namespace ModawantyAPI.Models
{
    /// <summary>
    /// Standard error response model for API exceptions
    /// </summary>
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string? Details { get; set; }
        public string? TraceId { get; set; }
        public Dictionary<string, string[]>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public ErrorResponse(int statusCode, string message, string? details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }
    }
}
