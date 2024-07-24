namespace anprAPI.Models.Domain
{
    public interface IDetectionRepository
    {
        List<Detection> GetAllDetections();
        List<Detector> GetAllDetectors();
        void UpdateDetections(List<Detection> detecions);

        Detector? GetDetectorById(Guid id);
        void AddDetector(Detector detector);
        void UpdateDetector(Detector detector);
        Detector? DeleteDetector(Guid id);

    }
}
