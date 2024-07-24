using anprAPI.Services.IServices;
using SixLabors.ImageSharp;
using YoloDotNet;
using YoloDotNet.Models;

namespace anprAPI.Services.ServicesImpl
{
    public class PlateDetectorService : IDetectorService
    {
        private readonly Yolo yoloModel;

        public PlateDetectorService(Yolo yoloModel)
        {
            this.yoloModel = yoloModel;
        }
        public IEnumerable<ObjectDetection> Detect(Image image, double confidence)
        {
            var results = yoloModel.RunObjectDetection(image, confidence);
            return results;
        }
    }
}
