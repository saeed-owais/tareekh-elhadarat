using System.Net;

namespace ModawantyBLL.Helpers
{
    /// <summary>
    /// Helper class for security-related operations
    /// </summary>
    public static class SecurityHelper
    {
        /// <summary>
        /// HTML encodes a string to prevent XSS attacks
        /// </summary>
        /// <param name="text">The text to encode</param>
        /// <returns>HTML encoded string</returns>
        public static string HtmlEncode(string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;

            return WebUtility.HtmlEncode(text);
        }

        /// <summary>
        /// HTML decodes a string
        /// </summary>
        /// <param name="text">The text to decode</param>
        /// <returns>HTML decoded string</returns>
        public static string HtmlDecode(string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;

            return WebUtility.HtmlDecode(text);
        }
    }
}