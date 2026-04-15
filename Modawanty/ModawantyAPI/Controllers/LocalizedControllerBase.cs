using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;

namespace ModawantyAPI.Controllers
{
    public abstract class LocalizedControllerBase : ControllerBase
    {
        private readonly ExceptionMessageLocalizer _localizer;

        protected LocalizedControllerBase(ExceptionMessageLocalizer localizer)
        {
            _localizer = localizer;
        }

        protected string L(string key) => _localizer.Get(key);

        protected string[] LocalizeErrors(string[]? errors)
        {
            if (errors == null || errors.Length == 0)
                return Array.Empty<string>();

            return errors.Select(LocalizeError).ToArray();
        }

        private string LocalizeError(string error)
        {
            if (string.IsNullOrWhiteSpace(error))
                return error;

            const string invalidTagIdsPrefix = "Invalid tag IDs:";

            if (error.StartsWith(invalidTagIdsPrefix, StringComparison.OrdinalIgnoreCase))
            {
                var invalidIds = error[invalidTagIdsPrefix.Length..].Trim();
                return string.IsNullOrWhiteSpace(invalidIds)
                    ? L("Invalid tag IDs")
                    : $"{L("Invalid tag IDs:")} {invalidIds}";
            }

            return L(error);
        }
    }
}
