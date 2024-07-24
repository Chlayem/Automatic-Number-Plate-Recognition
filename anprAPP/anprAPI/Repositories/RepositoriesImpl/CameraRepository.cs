using anprAPI.Common;
using anprAPI.Models.Domain;

namespace anprAPI.Repositories.RepositoriesImpl
{
    public class CameraRepository : ICameraRepository
    {
        private readonly Data _data;
        public CameraRepository(Data data)
        {
            _data = data;
        }
        public List<Camera> GetAllCameras() => _data.Cameras;

        public Camera? GetCameraById(Guid? id) =>
            _data.Cameras.FirstOrDefault(c => c.Id == id);

        public void AddCamera(Camera camera)
        {
            _data.Cameras.Add(camera);
            JSON.Save(_data);
        }

        public void UpdateCamera(Camera camera)
        {
            var index = _data.Cameras.FindIndex(c => c.Id == camera.Id);
            if (index != -1)
            {
                _data.Cameras[index] = camera;
                JSON.Save(_data);
            }
        }

        public Camera? DeleteCamera(Guid id)
        {
            var camera = _data.Cameras.FirstOrDefault(c => c.Id == id);
            if (camera != null)
            {
                _data.Cameras.Remove(camera);
                JSON.Save(_data);
                return camera;
            }
            return null;
        }
    }
}
