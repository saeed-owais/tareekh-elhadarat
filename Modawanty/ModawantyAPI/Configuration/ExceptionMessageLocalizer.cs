using Microsoft.AspNetCore.Localization;
using System.Globalization;
using System.Text.Json;

namespace ModawantyAPI.Configuration
{
    public class ExceptionMessageLocalizer
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Dictionary<string, Dictionary<string, string>> _cache = new();
        private readonly object _lock = new();

        public ExceptionMessageLocalizer(
            IWebHostEnvironment environment,
            IHttpContextAccessor httpContextAccessor)
        {
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }

        public string Get(string key)
        {
            var culture = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.UICulture.TwoLetterISOLanguageName
                ?? CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;

            var messages = GetMessages(culture);
            if (messages.TryGetValue(key, out var value))
            {
                return value;
            }

            var englishMessages = GetMessages("en");
            return englishMessages.TryGetValue(key, out var englishValue) ? englishValue : key;
        }

        private Dictionary<string, string> GetMessages(string culture)
        {
            lock (_lock)
            {
                if (_cache.TryGetValue(culture, out var cached))
                {
                    return cached;
                }

                var resourcePath = Path.Combine(_environment.ContentRootPath, "Resources", $"ExceptionMessages.{culture}.json");
                if (!File.Exists(resourcePath))
                {
                    return culture == "en" ? new Dictionary<string, string>() : GetMessages("en");
                }

                var json = File.ReadAllText(resourcePath);
                var values = JsonSerializer.Deserialize<Dictionary<string, string>>(json) ?? new Dictionary<string, string>();
                _cache[culture] = values;
                return values;
            }
        }
    }
}
