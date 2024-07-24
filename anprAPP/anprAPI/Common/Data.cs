using System.Text;
using anprAPI.Models.Domain;
using Stream = anprAPI.Models.Domain.Stream;

namespace anprAPI.Common
{
    public class Data
    {
        public List<Camera> Cameras { get; set; }
        public List<Detector> Detectors { get; set; }
        public List<Detection> Detections { get; set; }
        public Data()
        {
            Cameras = [];
            Detectors = [];
            Detections = [];
        }
        public override string ToString()
        {
            var builder = new StringBuilder();
            builder.AppendLine("Cameras:");
            foreach (var camera in Cameras)
            {
                builder.AppendLine($"  Camera ID: {camera.Id}, Label: {camera.Label}");
                builder.AppendLine($"    Stream ID: {camera.Stream.Id}, Label: {camera.Stream.Label}, URL: {camera.Stream.Url}");
            }

            builder.AppendLine("Detectors:");
            foreach (var detector in Detectors)
            {
                builder.AppendLine($"  Detector ID: {detector.Id}, Label: {detector.Label}," +
                    $" Associated Camera ID: {detector.Camera?.Id}, vehicule Confidence :{detector.VehiculeConfidence}, ocr Confidence :{detector.OcrConfidence},Active :{detector.Active}");
            }

            return builder.ToString();
        }
    }
    public static class DataSeeder
    {
        public static void SeedData(Data data)
        {
            if (!data.Cameras.Any())
            {
                var camera1 = new Camera()
                {
                    Id = Guid.NewGuid(),
                    Label = "Camera d'entrée",
                    Stream = new Stream ("Assets/Media/cars.mp4","Stream 1")
                };

                var camera2 = new Camera
                {
                    Id = Guid.NewGuid(),
                    Label = "Camera de sortie",
                    Stream = new Stream( "Assets/Media/test.mp4","Stream 2")
                };

                data.Cameras.Add(camera1);
                data.Cameras.Add(camera2);

                var detector1 = new Detector
                {
                    Id = Guid.NewGuid(),
                    Label = "Detecteur 1",
                    Camera = camera1
                };

                var detector2 = new Detector
                {
                    Id = Guid.NewGuid(),
                    Label = "Detecteur 2",
                    Camera = camera2
                };

                data.Detectors.Add(detector1);
                data.Detectors.Add(detector2);
            }

            JSON.Save(data);
        }
    }

}


