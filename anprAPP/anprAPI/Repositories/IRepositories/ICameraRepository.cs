namespace anprAPI.Models.Domain
{
    public interface ICameraRepository
    {
        List<Camera> GetAllCameras();
        Camera? GetCameraById(Guid? id);
        void AddCamera(Camera camera);
        void UpdateCamera(Camera camera);
        Camera? DeleteCamera(Guid id);
    }
}
