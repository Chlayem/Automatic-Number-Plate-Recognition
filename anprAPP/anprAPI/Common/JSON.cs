using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace anprAPI.Common
{
    public static class JSON
    {
        private const int MaxRetries = 3;
        private const int DelayMilliseconds = 100;
        public static void Save(object obj, string filename="data")
        {
            JsonSerializerSettings jsonSettings = new JsonSerializerSettings()
            {
                TypeNameHandling = TypeNameHandling.Auto
            };
            var json = JsonConvert.SerializeObject(obj, jsonSettings);
            for (int attempt = 0; attempt < MaxRetries; attempt++)
            {
                try
                {
                    using (var fileStream = new FileStream(filename, FileMode.Create, FileAccess.Write, FileShare.None))
                    using (var textWriter = new StreamWriter(fileStream))
                    {
                        textWriter.Write(json);
                    }
                    break; 
                }
                catch (IOException)
                {
                    if (attempt == MaxRetries - 1) throw;
                    Thread.Sleep(DelayMilliseconds);
                }
            }
        }
        public static T Load<T>(string filename = "data") where T : new()
        {
            try
            {
                using (var fileStream = new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.Read))
                using (var textReader = new StreamReader(fileStream))
                {
                    string json = textReader.ReadToEnd();
                    JsonSerializerSettings jsonSettings = new JsonSerializerSettings()
                    {
                        TypeNameHandling = TypeNameHandling.Auto
                    };
                    return JsonConvert.DeserializeObject<T>(json, jsonSettings);
                }
            }
            catch
            {
                return new T();
            }

        }
        public static string SerializeObject(object obj)
        {
            string json = JsonConvert.SerializeObject(obj, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
            return json;
        }
    }
}
