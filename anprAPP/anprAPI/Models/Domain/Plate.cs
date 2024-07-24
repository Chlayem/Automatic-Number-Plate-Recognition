using SixLabors.ImageSharp;

namespace anprAPI.Models.Domain
{
    public class Plate
    {
        public Image Image { get; set; }
        public double Score { get; set; }
        public string Text { get; set; }
        public CustomRectangle BoundingBox { get; set; }
    }
}
