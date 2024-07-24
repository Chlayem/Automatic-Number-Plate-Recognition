using System.Diagnostics;
using anprAPI.Models.Domain;
using anprAPI.Models.DTO;
using anprAPI.Services;
using anprAPI.Services.IServices;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;

namespace anprAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetectorController : ControllerBase
    {
        private readonly IDetectionRepository detectorRepository;
        private readonly ICameraRepository cameraRepository;
        private readonly IMapper mapper;
        private readonly IDetectionManagerService detectionManager;
        private readonly ICameraManagerService cameraManagerService;

        public DetectorController(IDetectionRepository detectorRepository,ICameraRepository cameraRepository, IMapper mapper,IDetectionManagerService detectionManager,ICameraManagerService cameraManagerService)
        {
            this.detectorRepository = detectorRepository;
            this.cameraRepository = cameraRepository;
            this.mapper = mapper;
            this.detectionManager = detectionManager;
            this.cameraManagerService = cameraManagerService;
        }

      /*  [HttpGet("detect/{detectorId}")]
        public  IActionResult GetDetectedFrame(Guid detectorId)
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();

            var detector = detectorRepository.GetDetectorById(detectorId);
            if (detector == null || detector.Camera == null)
            {
                return NotFound("Detector or camera not found.");
            }
            try
            {
                var frameStream = cameraManagerService.GetFrame(detector.Camera.Id);
                if (frameStream == null)
                {
                    return NotFound("No frame available for detection.");
                }
                //if (detector.Active) { 
                var image = detectionService.Detect(frameStream,detectorId);
                var outputStream = new MemoryStream();
                image.SaveAsJpeg(outputStream);
                //frameStream = detectionService.GetDetectedFrame(detectorId);
                if (outputStream == null )
                {
                    return NotFound("No detected frame available");
                }
                outputStream.Position = 0;
                //}
                stopWatch.Stop();
                Console.WriteLine($"Time taken for API: {stopWatch.ElapsedMilliseconds} ms");

                return File(outputStream, "image/jpeg");
            }
            catch (KeyNotFoundException knf)
            {
                return NotFound(knf.Message);
            }

            catch (Exception ex) 
            {
                return StatusCode(500, $"Detection failed: {ex.Message}");

            }
        }*/

        [HttpGet("detectedFrame/{detectorId}")]
        public IActionResult GetFrame(Guid detectorId)
        {
            var detector = detectorRepository.GetDetectorById(detectorId);
            if (detector == null || detector.Camera == null)
            {
                return NotFound("Detector or camera not found.");
            }
            try
            {
                System.IO.Stream? frameStream;
                if (detector.Active)
                {
                    frameStream = detectionManager.GetDetectedFrame(detectorId);
                    if (frameStream == null)
                    {
                        return NotFound("No detection.");
                    }
                }
                else
                {
                    frameStream = cameraManagerService.GetFrame(detector.Camera.Id);
                    if (frameStream == null)
                    {
                        return NotFound("No Frame available.");
                    }
                }
                frameStream.Position = 0;
                return File(frameStream, "image/jpeg");
            }
            catch (KeyNotFoundException knf)
            {
                return NotFound(knf.Message);
            }

            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving frame: {ex.Message}");
            }
        }

        [HttpPost("services")]
        public ActionResult InitializeServices()
        {
            var detectors = detectorRepository.GetAllDetectors();
            foreach(var detector in detectors)
            {
                detectionManager.AddService(detector);
            }
            return Ok(detectors);

        }

        [HttpGet("detectedVehicles/{detectorId}")]
        public ActionResult<IEnumerable<VehicleDto>> GetVehicles(Guid detectorId)
        {
            var vehicles = detectionManager.GetDetectedVehicles(detectorId);
            if(vehicles == null || !vehicles.Any())
            {
                return NoContent();
            }
            var vehicleDtos = vehicles.Select(vehicle => new VehicleDto
            {
                VehicleBoundingBox = vehicle.BoundingBox,
                PlateBoundingBox = vehicle.Plate?.BoundingBox,
                PlateText = vehicle.Plate?.Text,
            });
            return Ok(vehicleDtos);
        }
        [HttpGet("detections")]
        public ActionResult<IEnumerable<Detection>> GetDetections()
        {
            var detections = detectionManager.GetDetections();
            if (detections == null || !detections.Any())
            {
                return NoContent();
            }
            return Ok(detections.OrderByDescending(d => d.Date));
        }


        [HttpGet]
        public ActionResult<IEnumerable<DetectorDto>> GetAllDetectors()
        {
            var detectors = detectorRepository.GetAllDetectors();
            return Ok(mapper.Map<IEnumerable<DetectorDto>>(detectors));
        }

        [HttpGet("{id}")]
        public ActionResult<DetectorDto> GetDetectorById(Guid id)
        {
            var detector = detectorRepository.GetDetectorById(id);
            if (detector == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<DetectorDto>(detector));
        }

        [HttpPost]
        public ActionResult<DetectorDto> AddDetector([FromBody] AddDetectorDto detectorDto)
        {
            Camera? camera = null;
            if (detectorDto.CameraId != null)
            {
                camera = cameraRepository.GetCameraById(detectorDto.CameraId);
                if (camera == null)
                {
                    return BadRequest("Invalid CameraId");
                }
            }

            var detector = new Detector
            {
                Id = Guid.NewGuid(),
                Label = detectorDto.Label,
                Camera = camera,
                OcrConfidence = detectorDto.OcrConfidence,
                VehiculeConfidence = detectorDto.VehiculeConfidence,
                Active = detectorDto.Active,
            };
            detectorRepository.AddDetector(detector);
            detectionManager.AddService(detector);
            return CreatedAtAction(nameof(GetDetectorById), new { id = detector.Id }, mapper.Map<DetectorDto>(detector));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDetector(Guid id, [FromBody] AddDetectorDto detectorDto)
        {
    
            var detector = detectorRepository.GetDetectorById(id);
            if (detector == null)
            {
                return NotFound();
            }
            Camera? camera = null;
            if (detectorDto.CameraId != null)
            {
                camera = cameraRepository.GetCameraById(detectorDto.CameraId);
                if (camera == null)
                {
                    return BadRequest("Invalid CameraId");
                }
            }
            detector.Camera = camera;
            detector.Label = detectorDto.Label;
            detector.OcrConfidence = detectorDto.OcrConfidence;
            detector.VehiculeConfidence = detectorDto.VehiculeConfidence;
            detector.Active = detectorDto.Active;
            detectionManager.AddService(detector);
            detectorRepository.UpdateDetector(detector);
            return Ok(mapper.Map<DetectorDto>(detector));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDetector(Guid id)
        {
            var detector = detectorRepository.DeleteDetector(id);
            if (detector == null)
            {
                return NotFound();
            }
            detectionManager.RemoveService(id);
            return Ok(mapper.Map<DetectorDto>(detector));
        }
    }

}
