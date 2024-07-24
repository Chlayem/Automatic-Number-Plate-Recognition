using anprAPI.Services.IServices;
using SixLabors.ImageSharp;
using YoloDotNet;
using YoloDotNet.Models;

namespace anprAPI.Services.ServicesImpl
{
    public class OcrDetectorService : IDetectorService
    {
        private readonly Yolo yoloModel;

        public OcrDetectorService(Yolo yoloModel)
        {
            this.yoloModel = yoloModel;
        }
        public IEnumerable<ObjectDetection> Detect(Image image, double confidence = 0.45)
        {
            var characters = yoloModel.RunObjectDetection(image, confidence).OrderBy(_ => _.BoundingBox.X);
            return characters;
        }
    }
}
