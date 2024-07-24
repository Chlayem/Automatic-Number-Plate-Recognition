
using anprAPI.Models.Domain;

namespace anprAPI.Models.DTO
{
    public class AddCameraDto
    {
        public string Label { get; set; }
        public string Url { get; set; }
        public CustomRectangle ROI { get; set; }
    }
}
