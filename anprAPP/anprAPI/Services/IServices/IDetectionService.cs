using SixLabors.ImageSharp;

namespace anprAPI.Services.IServices
{
    public interface IDetectionService
    {
        Image Detect(System.IO.Stream frameStream, Guid detectorId);
        public System.IO.Stream? GetDetectedFrame(Guid detectorId);

    }
}
