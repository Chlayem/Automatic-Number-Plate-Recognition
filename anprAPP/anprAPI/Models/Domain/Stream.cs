namespace anprAPI.Models.Domain
{
    public class Stream : BaseEntity
    {
        public string Label { get; set; }
        public string Url { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public Stream(string url, string label = "HD")
        {
            Id = Guid.NewGuid();
            Label = label;
            Url = url;
        }

    }
}
