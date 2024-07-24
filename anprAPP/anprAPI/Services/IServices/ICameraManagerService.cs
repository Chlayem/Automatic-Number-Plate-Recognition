namespace anprAPI.Services.IServices
{
    public interface ICameraManagerService
    {
        bool StartCamera(Guid cameraId);
        System.IO.Stream? GetFrame(Guid cameraId);
        void StopCamera(Guid cameraId);
    }
}
