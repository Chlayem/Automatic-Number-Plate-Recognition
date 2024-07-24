using SixLabors.ImageSharp;

namespace anprAPI.Models.Domain
{
    public class Vehicle
    {
        public Image Image { get; set; }
        public double Score { get; set; }
        public Plate? Plate { get; set; }
        public CustomRectangle BoundingBox { get; set; }
        public string VehicleImageBase64 { get; set; }


    }
}
