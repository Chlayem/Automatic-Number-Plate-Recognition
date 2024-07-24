using Emgu.CV;
using SixLabors.ImageSharp;
using Timer = System.Timers.Timer;


namespace anprAPI.Models.Domain
{
    public class Camera : BaseEntity
    {
        public string Label { get; set; }
        public Stream Stream { get; set; }
        public CustomRectangle ROI { get; set; } = new CustomRectangle();
        
        
        /* public ICameraService CameraService { get; set; }
         public VideoCapture VideoCapture { get; set; }
         public Timer Timer { get; set; }
         public bool IsCapturing { get; set; } = false;
 */

    }
    public class CustomRectangle
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public CustomRectangle(int x =0,int y = 0,int width = 0,int height = 0)
        {
            X = x;
            Y = y;
            Width = width;
            Height = height;
        }
    }
}
