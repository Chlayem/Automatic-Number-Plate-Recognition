using anprAPI.Models.Domain;

namespace anprAPI.Services.IServices
{
    public interface IDetectionManagerService
    {
        void AddService(Detector detector);
        void RemoveService(Guid detectorId);
        System.IO.Stream? GetDetectedFrame(Guid detectorId);
        List<Vehicle> GetDetectedVehicles(Guid detectorId);

        List<Detection> GetDetections();

    }
}
