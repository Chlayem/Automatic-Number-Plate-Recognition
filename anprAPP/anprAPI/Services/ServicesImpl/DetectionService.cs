using anprAPI.Models.Domain;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using YoloDotNet;
using YoloDotNet.Models;
using Stream = System.IO.Stream;
using YoloDotNet.Extensions;
using System.Diagnostics;
using Detector = anprAPI.Models.Domain.Detector;
using SixLabors.ImageSharp.Processing;
using System.Diagnostics.Metrics;
using anprAPI.Services.IServices;

namespace anprAPI.Services.ServicesImpl
{
    public class DetectionService
    {
        private readonly IDetectorService vehiculeDetector;
        private readonly IDetectorService plateDetector;
        private readonly IDetectorService ocrDetector;
        private readonly Detector detector;
        private byte[]? detectedFrameData;
        private List<Vehicle> vehicles = [];
        public DetectionService(IDetectorService vehiculeDetector, IDetectorService plateDetector, IDetectorService ocrDetector, Detector detector)
        {
            this.vehiculeDetector = vehiculeDetector;
            this.plateDetector = plateDetector;
            this.ocrDetector = ocrDetector;
            this.detector = detector;

        }
        public void Detect(Stream frameStream)
        {
            //const string baseDirectory = @"Assets/Test";
            var stopwatch1 = new Stopwatch();
            var stopwatch2 = new Stopwatch();
            stopwatch1.Start();
            List<ObjectDetection> detectionsToDraw = [];
            var currentVehicles = new List<Vehicle>();
            try
            {
                frameStream.Position = 0;
                using var image = Image.Load<Rgba32>(frameStream);

                Console.Write("Image loaded...\t");
                stopwatch2.Start();

                var roi = detector.Camera.ROI;
                var roiRectangle = new Rectangle(roi.X, roi.Y, roi.Width, roi.Height);

                IEnumerable<ObjectDetection> results = vehiculeDetector.Detect(image, detector.VehiculeConfidence);
                var vehiclesInRoi = results.Where(d => d.BoundingBox.IntersectsWith(roiRectangle));

                var bestDetection = vehiclesInRoi.OrderByDescending(d => d.Confidence).FirstOrDefault();

                //int counter = 0;
                //foreach (var bestDetection in results)
                //{
                if (bestDetection != null)// && bestDetection.BoundingBox.IntersectsWith(roiRectangle))
                {
                    detectionsToDraw.Add(bestDetection);
                    using var vehicleImage = image.Clone();

                    vehicleImage.Mutate(ctx => ctx.Crop(bestDetection.BoundingBox));
                    /*string vehicleImagePath = Path.Combine(baseDirectory, $"vehicle_{counter}.jpeg");
                    vehicleImage.SaveAsJpeg(vehicleImagePath);*/
                    using var ms = new MemoryStream();
                    vehicleImage.SaveAsJpeg(ms);
                    var imageBytes = ms.ToArray();
                    var base64 = Convert.ToBase64String(imageBytes);

                    var platesDetected = plateDetector.Detect(vehicleImage, detector.OcrConfidence);
                    var bestPlate = platesDetected.OrderByDescending(obj => obj.Confidence).FirstOrDefault();
                    Plate? plate = null;

                    if (bestPlate != null)
                    {
                        using var plateImage = vehicleImage.Clone();
                        plateImage.Mutate(ctx => ctx.Crop(bestPlate.BoundingBox));
                        /* string plateImagePath = Path.Combine(baseDirectory, $"plate_{counter}.jpeg");
                         plateImage.SaveAsJpeg(plateImagePath);*/

                        var newBB = new Rectangle(bestPlate.BoundingBox.X + bestDetection.BoundingBox.X, bestPlate.BoundingBox.Y + bestDetection.BoundingBox.Y, bestPlate.BoundingBox.Width, bestPlate.BoundingBox.Height);
                        bestPlate.BoundingBox = newBB;
                        detectionsToDraw.Add(bestPlate);
                        var characters = ocrDetector.Detect(plateImage, detector.OcrConfidence);
                        string plateText = string.Join("", characters.Select(_ => _.Label.Name));
                        Console.WriteLine(plateText);
                        plate = new Plate
                        {
                            Image = plateImage,
                            Score = bestPlate.Confidence,
                            Text = plateText,
                            BoundingBox = new CustomRectangle(bestPlate.BoundingBox.X, bestPlate.BoundingBox.Y, bestPlate.BoundingBox.Width, bestPlate.BoundingBox.Height)
                        };
                    }

                    var vehicle = new Vehicle
                    {
                        Image = vehicleImage,
                        VehicleImageBase64 = base64,
                        Score = bestDetection.Confidence,
                        Plate = plate,
                        BoundingBox = new CustomRectangle(bestDetection.BoundingBox.X, bestDetection.BoundingBox.Y, bestDetection.BoundingBox.Width, bestDetection.BoundingBox.Height)
                    };
                    currentVehicles.Add(vehicle);
                    //counter++;
                }
                //}
                vehicles = currentVehicles;


                stopwatch2.Stop();
                Console.Write("Detection run...\t");

                image.Draw(detectionsToDraw);

                stopwatch1.Stop();

                using var stream = new MemoryStream();
                image.SaveAsJpeg(stream);
                detectedFrameData = stream.ToArray();


                /*if (!frames.TryAdd(detectorId, frameData))
                {
                    frames[detectorId] = frameData;
                }*/


                Console.Write("Detection Complete!");
                Console.WriteLine();
                Console.WriteLine($"Time taken for detection: {stopwatch2.ElapsedMilliseconds} ms");
                Console.WriteLine($"Time taken for process: {stopwatch1.ElapsedMilliseconds} ms");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during detection: {ex.Message}");
                throw;
            }
        }
        public Stream? GetDetectedFrame()
        {
            if (detectedFrameData != null)
            {
                var memStream = new MemoryStream(detectedFrameData);
                memStream.Seek(0, SeekOrigin.Begin);
                return memStream;
            }
            return null;
        }

        public List<Vehicle> GetDetectedVehicles()
        {
            return vehicles;
        }

    }
}
