using anprAPI.Models.Domain;

namespace anprAPI.Models.DTO
{
    public class VehicleDto
    {
        public CustomRectangle VehicleBoundingBox { get; set; }
        public CustomRectangle? PlateBoundingBox { get; set; }
        public string? PlateText { get; set; }
    }
}
