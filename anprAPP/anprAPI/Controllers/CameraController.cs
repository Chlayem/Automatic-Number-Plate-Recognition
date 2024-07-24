using anprAPI.Models.Domain;
using anprAPI.Models.DTO;
using anprAPI.Services.IServices;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace anprAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CameraController : ControllerBase
    {
        private readonly ICameraRepository cameraRepository;
        private readonly ICameraManagerService cameraManagerService;
        private readonly IMapper mapper;
        public CameraController(ICameraRepository cameraRepository,ICameraManagerService cameraManagerService, IMapper mapper)
        {
            this.cameraRepository = cameraRepository;
            this.cameraManagerService = cameraManagerService;
            this.mapper = mapper;
        }

        [HttpPost("start/{id}")]
        public IActionResult StartCamera(Guid id)
        {
            try
            {
                bool alreadyStarted = cameraManagerService.StartCamera(id);
                if (!alreadyStarted)
                    return Ok($"Camera {id} started successfully.");
                return Ok($"Camera {id} was already started.");

            }
            catch (Exception ex)
            {
                return BadRequest($"Error starting camera: {ex.Message}");
            }

        }
        [HttpGet("frame/{cameraId}")]
        public IActionResult GetFrame(Guid cameraId)
        {
            try
            {
                var frameStream = cameraManagerService.GetFrame(cameraId);
                if (frameStream == null)
                {
                    return NotFound("No more frames or video is not available.");
                }
                frameStream.Position = 0;
                return File(frameStream, "image/jpeg");
            }
            catch (KeyNotFoundException knf)
            {
                return NotFound(knf.Message);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving frame: {ex.Message}");
            }
        }

        [HttpPost("stop/{cameraId}")]
        public IActionResult StopCamera(Guid cameraId)
        {
            try
            {
                cameraManagerService.StopCamera(cameraId);
                return Ok($"Camera {cameraId} stopped successfully.");
            }
            catch (KeyNotFoundException knf)
            {
                return Ok(knf.Message);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error stopping camera: {ex.Message}");
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<CameraDto>> GetAllCameras()
        {
            var cameras = cameraRepository.GetAllCameras();

            return Ok(mapper.Map<IEnumerable<CameraDto>>(cameras));
        }

        [HttpGet("{id}")]
        public ActionResult<CameraDto> GetCameraById(Guid id)
        {
            var camera = cameraRepository.GetCameraById(id);
            if (camera == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<CameraDto>(camera));
        }

        [HttpPost]
        public ActionResult<CameraDto> AddCamera([FromBody] AddCameraDto cameraDto)
        {
            bool urlExists = cameraRepository.GetAllCameras().Any(cam => cam.Stream.Url == cameraDto.Url);
            if (urlExists)
            {
                return BadRequest("A camera with the specified URL already exists.");
            }
            var camera = mapper.Map<Camera>(cameraDto);
            cameraRepository.AddCamera(camera);
            var dto = mapper.Map<CameraDto>(camera);
            return CreatedAtAction(nameof(GetCameraById), new { id = camera.Id }, mapper.Map<CameraDto>(camera));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCamera(Guid id, [FromBody] AddCameraDto cameraDto)
        {
   

            var existingCamera = cameraRepository.GetCameraById(id);
            if (existingCamera == null)
            {
                return NotFound();
            }
            if (existingCamera.Stream.Url != cameraDto.Url)
            {
                bool urlExists = cameraRepository.GetAllCameras().Any(cam => cam.Stream.Url == cameraDto.Url);
                if (urlExists)
                {
                    return BadRequest("A camera with the specified URL already exists.");
                }
                cameraManagerService.StopCamera(id);
                existingCamera.Stream.Url = cameraDto.Url;
                existingCamera.Label = cameraDto.Label;
                existingCamera.ROI  = cameraDto.ROI;
                cameraRepository.UpdateCamera(existingCamera); 
                cameraManagerService.StartCamera(id); 
            }
            else
            {
                existingCamera.Label = cameraDto.Label;
                existingCamera.ROI = cameraDto.ROI;
                cameraRepository.UpdateCamera(existingCamera);
            }
                        
            return Ok(mapper.Map<CameraDto>(existingCamera));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCamera(Guid id)
        {
            var camera = cameraRepository.DeleteCamera(id);

            if (camera == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<CameraDto>(camera));
        }
    }
}
