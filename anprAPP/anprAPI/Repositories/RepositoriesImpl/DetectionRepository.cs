using anprAPI.Common;
using anprAPI.Models.Domain;
namespace anprAPI.Repositories.RepositoriesImpl
{
    public class DetectionRepository : IDetectionRepository
    {
        private readonly Data _data;
        private readonly object _lock = new object();

        public DetectionRepository(Data data)
        {
            _data = data;
        }

        public List<Detection> GetAllDetections() => _data.Detections;

        public void UpdateDetections(List<Detection> newDetections)
        {
            _data.Detections = newDetections;
            JSON.Save(_data);
        }
        public List<Detector> GetAllDetectors()
        {
            lock (_lock)
            {
                return _data.Detectors;
            }
        }

        public Detector? GetDetectorById(Guid id)

        {
            lock (_lock)
            {

                return _data.Detectors.FirstOrDefault(d => d.Id == id);
            }

        }

        public void AddDetector(Detector detector)
        {
            lock (_lock)
            {

                _data.Detectors.Add(detector);
                JSON.Save(_data);
            }

        }

        public void UpdateDetector(Detector detector)
        {
            lock (_lock)
            {
                var index = _data.Detectors.FindIndex(d => d.Id == detector.Id);
                if (index != -1)
                {
                    _data.Detectors[index] = detector;
                    JSON.Save(_data);
                }

            }
        }

        public Detector? DeleteDetector(Guid id)
        {
            lock (_lock)
            {

                var detector = _data.Detectors.FirstOrDefault(d => d.Id == id);
                if (detector != null)
                {
                    _data.Detectors.Remove(detector);
                    JSON.Save(_data);
                    return detector;
                }
                return null;

            }
        }
    }
}
