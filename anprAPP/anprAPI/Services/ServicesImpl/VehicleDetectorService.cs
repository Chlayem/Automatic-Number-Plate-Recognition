using anprAPI.Services.IServices;
using SixLabors.ImageSharp;
using YoloDotNet;
using YoloDotNet.Models;

namespace anprAPI.Services.ServicesImpl
{
    public class VehicleDetectorService : IDetectorService
    {
        private readonly Yolo yoloModel;

        public VehicleDetectorService(Yolo yoloModel)
        {
            this.yoloModel = yoloModel;
        }

        public IEnumerable<ObjectDetection> Detect(Image image, double confidence)
        {
            var results = yoloModel.RunObjectDetection(image, confidence);
            return results.Where(d => d.Label.Name.Equals("car") || d.Label.Name.Equals("bus") || d.Label.Name.Equals("truck")).ToList();
        }
    }
}
