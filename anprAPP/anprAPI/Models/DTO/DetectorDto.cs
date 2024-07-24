namespace anprAPI.Models.DTO
{
    public class DetectorDto
    {
        public Guid Id { get; set; }
        public string Label { get; set; }
        public Guid? CameraId { get; set; }
        public double OcrConfidence { get; set; }
        public double VehiculeConfidence { get; set; } 
        public bool Active { get; set; }
    }
}
