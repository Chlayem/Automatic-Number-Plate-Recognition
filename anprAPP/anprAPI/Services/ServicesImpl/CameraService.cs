/*using anprAPI.Models.Domain;
using Emgu.CV;
using Emgu.CV.Structure;
using Microsoft.AspNetCore.SignalR;
using Stream = System.IO.Stream;
using Timer = System.Timers.Timer;

namespace anprAPI.Services
{
    public class CameraService : ICameraService
    {
        private readonly ICameraRepository cameraRepository;

        private Camera camera;
        private VideoCapture videoCapture;
        private Timer timer;
        private Image<Bgr, byte> frame;
        private byte[] frameData;

        public Camera Camera
        {
            get
            {
                return camera;
            }
            set
            {
                camera = value;
            }
        }
        public CameraService(ICameraRepository cameraRepository)
        {
            this.cameraRepository = cameraRepository;
        }

        public void Start(Guid cameraId)
        {
            var cam = ConnectedCameras.Cameras.FirstOrDefault(cam => cam.Id == cameraId);
            if (cam == null)
            {
                cam = cameraRepository.GetCameraById(cameraId);
                if (cam == null)
                    throw new Exception("Camera does not exist");

                cam.VideoCapture = new VideoCapture(cam.Stream.Url);
                videoCapture.ImageGrabbed += VideoCapture_ImageGrabbed;

                cam.Timer = new Timer(1000);
                cam.Timer.Elapsed += Timer_Elapsed;

                ConnectedCameras.Cameras.Add(cam);
            }
            if (!cam.IsCapturing)
            {
                cam.VideoCapture.Start();
                cam.Timer.Start();
                cam.IsCapturing = true;
            }
            camera = cam;
            videoCapture = camera.VideoCapture;
            timer = camera.Timer;

        }

        private void Timer_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
        {
            if (frame != null)
            {
                frameData = frame.ToJpegData();
            }
        }

        private void VideoCapture_ImageGrabbed(object? sender, EventArgs e)
        {
            using (Mat mat = videoCapture.QueryFrame())
                if (mat != null && !mat.IsEmpty)
                {
                    frame = mat.ToImage<Bgr, byte>();
                }
                else
                    videoCapture.Set(Emgu.CV.CvEnum.CapProp.PosFrames, 0);

        }

        public Stream? GetImage()
        {

            if (frame != null)
            {
                var memStream = new MemoryStream(frameData);
                memStream.Seek(0, SeekOrigin.Begin);
                return memStream;
            }
            return null;

        }
        public async Task<Stream?> GetImageAsync()
        {
            return await Task.FromResult(GetImage());
        }

        public void Stop(Guid cameraId)
        {
            var cam = ConnectedCameras.Cameras.FirstOrDefault(cam => cam.Id == cameraId);
            if (cam != null && camera.IsCapturing)
            {
                cam.VideoCapture.Stop();
                cam.VideoCapture.Dispose();
                cam.Timer.Stop();
                cam.Timer.Dispose();
                cam.IsCapturing = false;
                ConnectedCameras.Cameras.Remove(cam);
            }
        }
    }
*/

/*  public static class ConnectedCameras
  {
      public static List<Camera> Cameras { get; set; }
  }
}*/




/*public class CameraService
{
    private Camera camera;
    private readonly IHubContext<JpegStreamerHub> hubContext;
    private VideoCapture videoCapture;
    private Timer timer;
    private Image<Bgr, byte> frame;
    private byte[] frameData;
    private readonly object frameLock = new object();
    public CameraService(Camera camera, IHubContext<JpegStreamerHub> hubContext)
    {
        this.camera = camera;
        this.hubContext = hubContext;
        InitializeStream();
    }
    public void Init(Guid cameraId)
    {
        var camera = cameraRepository.GetCameraById(cameraId);

        if (camera == null)
        {
            throw (new Exception("Camera does not exist"));
        }
        if (!File.Exists(camera.Stream.Url))
        {
            throw (new Exception("File does not exist"));
        }
        if (cameraStreams.TryAdd(cameraId, new VideoCapture(camera.Stream.Url)))
        {
            Console.WriteLine($"Camera :{camera.Label} added ");

            videoCapture = cameraStreams[cameraId];
            videoCapture.Start();
        }
        else
        {
            Console.WriteLine("Camera already exists");
        }

    }*/


/*
public void InitializeStream()
{
    if (!File.Exists(camera.Stream.Url))
    {
        throw new Exception($"File {camera.Stream.Url} does not exist");
    }

    videoCapture = new VideoCapture(camera.Stream.Url);
    timer = new Timer(200);

    videoCapture.ImageGrabbed += VideoCapture_ImageGrabbed;
    timer.Elapsed += Timer_Elapsed;
}
public void Start()
{
    videoCapture.Start();
    timer.Start();
}
private void Timer_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
{
    lock (frameLock)
    {
        if (frame != null)
        {
            frameData = frame.ToJpegData();
            hubContext.Clients.Group($"{camera.Id}").SendAsync("FrameReady", $"{camera.Id}");
        }
    }

}

private void VideoCapture_ImageGrabbed(object? sender, EventArgs e)
{
    lock (frameLock)
    {

        using (Mat mat = videoCapture.QueryFrame())
            if (mat != null && !mat.IsEmpty)
            {
                frame = mat.ToImage<Bgr, byte>();
            }
            else
                videoCapture.Set(Emgu.CV.CvEnum.CapProp.PosFrames, 0);

    }
}


public Stream? GetImage()
{

    if (frameData != null)
    {
        var memStream = new MemoryStream(frameData);
        memStream.Seek(0, SeekOrigin.Begin);
        return memStream;
    }
    return null;

}
public async Task<Stream?> GetImageAsync()
{
    return await Task.FromResult(GetImage());
}

public void Stop()
{
    videoCapture.Stop();
    videoCapture.Dispose();
    timer.Stop();
    timer.Dispose();
}
    }
}
*/


/*using anprAPI.Models.Domain;
using Microsoft.AspNetCore.SignalR;
using OpenCvSharp;
using Timer = System.Timers.Timer;
using Stream = System.IO.Stream;

namespace anprAPI.Services
{
    public class CameraService
    {
        private Camera camera;
        private readonly IHubContext<JpegStreamerHub> hubContext;
        private VideoCapture videoCapture;
        private Timer timer;
        private Mat frame;
        private byte[] frameData;
        private readonly object frameLock = new object();

        public CameraService(Camera camera, IHubContext<JpegStreamerHub> hubContext)
        {
            this.camera = camera;
            this.hubContext = hubContext;
            InitializeStream();
        }

        public void InitializeStream()
        {
            if (!File.Exists(camera.Stream.Url))
            {
                throw new Exception($"File {camera.Stream.Url} does not exist");
            }

            videoCapture = new VideoCapture();
            if (!videoCapture.Open(camera.Stream.Url))
            {
                throw new Exception("Failed to open video stream.");
            }

            timer = new Timer(200);
            timer.Elapsed += Timer_Elapsed;
        }

        public void Start()
        {
            timer.Start();
        }

        private void Timer_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
        {
            lock (frameLock)
            {
                frame = new Mat();
                if (videoCapture.Read(frame) && !frame.Empty())
                {
                    frameData = frame.ToBytes(".jpg");
                    hubContext.Clients.Group($"{camera.Id}").SendAsync("FrameReady", $"{camera.Id}");
                }
                else
                {
                    videoCapture.Set(VideoCaptureProperties.PosFrames, 0); // Reset the frame position if no frame is read
                }
            }
        }

        public Stream? GetImage()
        {
            if (frameData != null)
            {
                var memStream = new MemoryStream(frameData);
                memStream.Seek(0, SeekOrigin.Begin);
                return memStream;
            }
            return null;
        }

        public async Task<Stream?> GetImageAsync()
        {
            return await Task.FromResult(GetImage());
        }

        public void Stop()
        {
            videoCapture.Release();
            videoCapture.Dispose();
            timer.Stop();
            timer.Dispose();
        }
    }
}
*/

/*
using anprAPI.Models.Domain;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Timer = System.Timers.Timer;

namespace anprAPI.Services
{
    public class CameraService
    {
        private Camera camera;
        private readonly IHubContext<JpegStreamerHub> hubContext;
        private Timer timer;
        private byte[] frameData;
        private readonly object frameLock = new object();
        private Process ffmpegProcess;

        public CameraService(Camera camera, IHubContext<JpegStreamerHub> hubContext)
        {
            this.camera = camera;
            this.hubContext = hubContext;
            InitializeStream();
        }

        public void InitializeStream()
        {
            if (!File.Exists(camera.Stream.Url))
            {
                throw new Exception($"File {camera.Stream.Url} does not exist");
            }

            timer = new Timer(1000);
            timer.Elapsed += Timer_Elapsed;
        }

        public void Start()
        {
            StartFFmpeg();
            timer.Start();
        }

        private void StartFFmpeg()
        {
            ffmpegProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "ffmpeg",
                    Arguments = $"-i {camera.Stream.Url} -vf fps=5 -f image2pipe -vcodec mjpeg -",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            ffmpegProcess.OutputDataReceived += (sender, args) =>
            {
                lock (frameLock)
                {
                    if (args.Data != null)
                    {
                        frameData = System.Text.Encoding.Default.GetBytes(args.Data);
                    }
                }
            };
            ffmpegProcess.Start();
            ffmpegProcess.BeginOutputReadLine();
        }

        private void Timer_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
        {
            lock (frameLock)
            {
                if (frameData != null)
                {
                    hubContext.Clients.Group($"{camera.Id}").SendAsync("FrameReady", $"{camera.Id}");
                }
            }
        }

        public System.IO.Stream? GetImage()
        {
            if (frameData != null)
            {
                var memStream = new MemoryStream(frameData);
                memStream.Seek(0, SeekOrigin.Begin);
                return memStream;
            }
            return null;
        }

        public async Task<System.IO.Stream?> GetImageAsync()
        {
            return await Task.FromResult(GetImage());
        }

        public void Stop()
        {
            timer.Stop();
            timer.Dispose();
            if (ffmpegProcess != null && !ffmpegProcess.HasExited)
            {
                ffmpegProcess.Kill();
                ffmpegProcess.Dispose();
            }
        }
    }
}

*/


using anprAPI.Hubs;
using anprAPI.Models.Domain;
using Emgu.CV;
using Emgu.CV.Structure;
using Microsoft.AspNetCore.SignalR;
using Stream = System.IO.Stream;
using Timer = System.Timers.Timer;

namespace anprAPI.Services.ServicesImpl
{
    public class CameraService
    {
        private Camera camera;
        private readonly IHubContext<StreamHub> hubContext;
        private VideoCapture videoCapture;
        private Timer timer;
        private Image<Bgr, byte> frame;
        private byte[] frameData;
        private readonly object frameLock = new object();
        public CameraService(Camera camera, IHubContext<StreamHub> hubContext)
        {
            this.camera = camera;
            this.hubContext = hubContext;
            InitializeStream();
        }
        public void InitializeStream()
        {
            if (!File.Exists(camera.Stream.Url))
            {
                throw new Exception($"File {camera.Stream.Url} does not exist");
            }

            videoCapture = new VideoCapture(camera.Stream.Url);
            timer = new Timer(200);

            videoCapture.ImageGrabbed += VideoCapture_ImageGrabbed;
            timer.Elapsed += Timer_Elapsed;
        }
        public void Start()
        {
            videoCapture.Start();
            timer.Start();
        }
        private void Timer_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
        {
            lock (frameLock)
            {
                if (frame != null)
                {

                    frameData = frame.ToJpegData();
                    hubContext.Clients.Group($"{camera.Id}").SendAsync("FrameReady", $"{camera.Id}");
                }
            }

        }

        private void VideoCapture_ImageGrabbed(object? sender, EventArgs e)
        {
            lock (frameLock)
            {

                using (Mat mat = videoCapture.QueryFrame())
                    if (mat != null && !mat.IsEmpty)
                    {
                        frame = mat.ToImage<Bgr, byte>();
                    }
                    else
                        videoCapture.Set(Emgu.CV.CvEnum.CapProp.PosFrames, 0);

            }
        }


        public Stream? GetImage()
        {

            if (frameData != null)
            {
                var memStream = new MemoryStream(frameData);
                memStream.Seek(0, SeekOrigin.Begin);
                return memStream;
            }
            return null;

        }
        public async Task<Stream?> GetImageAsync()
        {
            return await Task.FromResult(GetImage());
        }

        public void Stop()
        {
            videoCapture.Stop();
            videoCapture.Dispose();
            timer.Stop();
            timer.Dispose();
        }
    }
}

