namespace anprAPI.Models.Domain
{
    public class Detector : BaseEntity
    {
        public string Label { get; set; }
        public Camera? Camera { get; set; }
        public double OcrConfidence { get; set; } = 0.25;
        public double VehiculeConfidence { get; set; } = 0.25;
        public bool Active { get; set; } = false;
    }
}
