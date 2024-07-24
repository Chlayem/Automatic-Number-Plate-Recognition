namespace anprAPI.Models.Domain
{
    public class Detection : BaseEntity
    {
        public DateTime Date {  get; set; }
        public string FormattedDate => Date.ToString("dd-MM-yyyy HH:mm:ss");
        public string CameraLabel { get; set; }
        public string DetectorLabel { get; set; }
        public string PlateText { get; set; }
        public string VehicleImageBase64 { get; set; }

    }
}
