using anprAPI.Models.Domain;
using SixLabors.ImageSharp;

namespace anprAPI.Models.DTO
{
    public class CameraDto
    {
        public Guid Id { get; set; }
        public string Label { get; set; }
        public string Url { get; set; }
        public CustomRectangle ROI { get; set; }
    }
}
