
using System.Collections.Concurrent;
using anprAPI.Hubs;
using anprAPI.Models.Domain;
using anprAPI.Repositories;
using anprAPI.Services.IServices;
using Microsoft.AspNetCore.SignalR;
using SixLabors.ImageSharp;
using YoloDotNet;
using Stream = System.IO.Stream;

namespace anprAPI.Services.ServicesImpl
{
    public class DetectionManagerService : BackgroundService, IDetectionManagerService
    {
        private static readonly ConcurrentDictionary<Guid, DetectionService> services = new ConcurrentDictionary<Guid, DetectionService>();
        private readonly IDetectionRepository detectorRepository;
        private readonly ILogger<DetectionManagerService> logger;
        private readonly ICameraManagerService cameraManagerService;
        private readonly IHubContext<DetectionHub> hubContext;
        private readonly IDetectorService vehicleDetector;
        private readonly IDetectorService plateDetector;
        private readonly IDetectorService ocrDetector;

        string MODELS_PATH = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "Models");

        public List<Detection> Detections = [];
        //const string MODELS_PATH = @"Assets/Models";

        public DetectionManagerService(IDetectionRepository detectorRepository, ILogger<DetectionManagerService> logger, ICameraManagerService cameraManagerService, IHubContext<DetectionHub> hubContext)
        {
            Detections = detectorRepository.GetAllDetections();
            this.detectorRepository = detectorRepository;
            this.logger = logger;
            this.cameraManagerService = cameraManagerService;
            this.hubContext = hubContext;

            var vehicleModel = new Yolo(Path.Combine(MODELS_PATH, "yolov8s.onnx"), false);
            this.logger.LogInformation("Vehicule model loaded...");
            vehicleDetector = new VehicleDetectorService(vehicleModel);

            var plateModel = new Yolo(Path.Combine(MODELS_PATH, "plate.onnx"), false);
            this.logger.LogInformation("Plate model loaded...");
            plateDetector = new PlateDetectorService(plateModel);

            var ocrModel = new Yolo(Path.Combine(MODELS_PATH, "ocr.onnx"), false);
            this.logger.LogInformation("OCR model loaded...");
            ocrDetector = new OcrDetectorService(ocrModel);

        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Execution Started...");

            while (!stoppingToken.IsCancellationRequested)
            {
                //logger.LogInformation("DetectionManagerService loop tick.");
                if (services.IsEmpty)
                {
                    await Task.Delay(3000);
                    continue;
                }
                foreach (var entry in services)
                {
                    var detectorId = entry.Key;
                    var service = entry.Value;
                    var detector = detectorRepository.GetDetectorById(detectorId);
                    if (detector != null && detector.Camera != null)
                    {
                        if (detector.Active)
                        {
                            var frameStream = cameraManagerService.GetFrame(detector.Camera.Id);
                            if (frameStream != null)
                            {
                                logger.LogInformation($"Performing detection for detector {detectorId}");

                                service.Detect(frameStream);
                                var vehicle = service.GetDetectedVehicles().FirstOrDefault();
                                if (vehicle != null && vehicle.Plate != null)
                                {
                                    var detection = new Detection
                                    {
                                        Id = Guid.NewGuid(),
                                        Date = DateTime.Now,
                                        CameraLabel = detector.Camera.Label,
                                        DetectorLabel = detector.Label,
                                        PlateText = vehicle.Plate.Text,
                                        VehicleImageBase64 = vehicle.VehicleImageBase64
                                    };
                                    Detections.Add(detection);
                                    logger.LogInformation($"Saving Detecions");
                                    detectorRepository.UpdateDetections(Detections);
                                }
                            }
                            await hubContext.Clients.Group(detectorId.ToString()).SendAsync("DetectedFrameReady", detectorId.ToString());
                        }
                    }
                }
                //await Task.Delay(200);
            }
        }

        /* private void InitializeDetectionServices()
         {
             var detectors = detectorRepository.GetAllDetectors();
             foreach (var detector in detectors)
             {
                 var service = new DetectionService(yolo,detector);
                 if(services.TryAdd(detector.Id, service))
                 {
                     logger.LogInformation($"Service added for detector {detector.Id}");
                 }
                 else
                 {
                     logger.LogWarning($"Service already exists for detector {detector.Id}");

                 }
             }
         }*/

        public void AddService(Detector detector)
        {
            if (!services.ContainsKey(detector.Id))
            {
                var service = new DetectionService(vehicleDetector, plateDetector, ocrDetector, detector);
                if (services.TryAdd(detector.Id, service))
                {
                    logger.LogInformation($"Detection service added for detector {detector.Id}");
                }
            }
            else
            {
                logger.LogWarning($"Failed to add service for detector {detector.Id} because it already exists.");
            }
        }

        public void RemoveService(Guid detectorId)
        {
            if (services.TryRemove(detectorId, out var _))
            {
                logger.LogInformation($"Service for detector {detectorId} removed successfully.");
            }
            else
            {
                logger.LogWarning($"Failed to remove service for detector {detectorId}.");

            }
        }

        public Stream? GetDetectedFrame(Guid detectorId)
        {
            if (services.TryGetValue(detectorId, out var service))
            {
                return service.GetDetectedFrame();
            }
            logger.LogError($"Detector not found for ID {detectorId}.");
            throw new KeyNotFoundException($"Detector not found for ID {detectorId}.");

        }

        public List<Vehicle> GetDetectedVehicles(Guid detectorId)
        {
            if (services.TryGetValue(detectorId, out var service))
            {
                return service.GetDetectedVehicles();
            }
            logger.LogError($"Detector not found for ID {detectorId}.");
            throw new KeyNotFoundException($"Detector not found for ID {detectorId}.");
        }

        public List<Detection> GetDetections()
        {
            lock (Detections)
            {
                return Detections;
            }
        }
    }

}

