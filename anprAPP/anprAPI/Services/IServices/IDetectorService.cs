using SixLabors.ImageSharp;
using YoloDotNet.Models;

namespace anprAPI.Services.IServices
{
    public interface IDetectorService
    {
        IEnumerable<ObjectDetection> Detect(Image image, double confidence);

    }
}
