using System.Collections.Concurrent;
using anprAPI.Hubs;
using anprAPI.Models.Domain;
using anprAPI.Services.ServicesImpl;
using Microsoft.AspNetCore.SignalR;

namespace anprAPI.Services.IServices
{
    public class CameraManagerService : ICameraManagerService
    {
        private static readonly ConcurrentDictionary<Guid, CameraService> cameraServices = new ConcurrentDictionary<Guid, CameraService>();
        private readonly ICameraRepository cameraRepository;
        private readonly IHubContext<StreamHub> hubContext;

        public CameraManagerService(ICameraRepository cameraRepository, IHubContext<StreamHub> hubContext)
        {
            this.cameraRepository = cameraRepository;
            this.hubContext = hubContext;
        }

        public bool StartCamera(Guid cameraId)
        {
            var camera = cameraRepository.GetCameraById(cameraId);
            if (camera == null)
            {
                throw new Exception($"Camera with ID {cameraId} does not exist.");
            }
            if (!cameraServices.ContainsKey(cameraId))
            {
                var service = new CameraService(camera, hubContext);
                if (cameraServices.TryAdd(cameraId, service))
                {
                    service.Start();
                    return false;
                }
            }
            Console.WriteLine($"Camera with ID {cameraId} is already started");
            return true;


        }

        public System.IO.Stream? GetFrame(Guid cameraId)
        {
            if (cameraServices.TryGetValue(cameraId, out var service))
            {
                return service.GetImage();
            }
            throw new KeyNotFoundException("Camera not found or not started.");
        }
        public void StopCamera(Guid cameraId)
        {
            if (cameraServices.TryRemove(cameraId, out var service))
            {
                service.Stop();
                return;
            }
            //throw new KeyNotFoundException("Camera not found or not started.");
        }

    }
}
