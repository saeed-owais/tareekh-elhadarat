using System.Net;
using System.Text.RegularExpressions;

namespace ModawantyBLL.Helpers
{

    public static class ReadTimeHelper
    {
        public static int CalculateReadTime(string htmlContent)
        {
            if (string.IsNullOrWhiteSpace(htmlContent))
                return 1;

            // 1. Count images (before removing them)
            int imageCount = Regex.Matches(htmlContent, "<img", RegexOptions.IgnoreCase).Count;

            // 2. Remove HTML tags
            string text = Regex.Replace(htmlContent, "<.*?>", string.Empty);

            // 3. Decode HTML entities (&nbsp; etc)
            text = WebUtility.HtmlDecode(text);

            // 4. Count words (supports Arabic + English)
            var words = Regex.Matches(text, @"\b[\w\u0600-\u06FF]+\b");
            int wordCount = words.Count;

            // 5. Choose reading speed
            int wordsPerMinute = 150; // better for Arabic + mixed content

            // 6. Calculate time
            double textTime = (double)wordCount / wordsPerMinute;
            double imageTime = imageCount * 0.2; // ~12 sec per image

            int minutes = (int)Math.Ceiling(textTime + imageTime);

            // 7. Ensure minimum 1 minute
            return Math.Max(1, minutes);
        }
    }
}
