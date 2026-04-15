using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ModawantyBLL.IService;
using ModawantyDAL.Models;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ModawantyBLL.Service
{
    public class BrevoEmailService : IEmailService
    {
        private const string BrevoEndpoint = "https://api.brevo.com/v3/smtp/email";
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<BrevoEmailService> _logger;

        public BrevoEmailService(HttpClient httpClient, IConfiguration config, ILogger<BrevoEmailService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<Result<bool>> SendEmailAsync(string toEmail, string subject, string message, CancellationToken cancellationToken)
        {
            try
            {
                var apiKey = _config["Brevo:ApiKey"];
                var fromEmail = _config["Brevo:FromEmail"];
                var fromName = _config["Brevo:FromName"];

                if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(fromEmail) || string.IsNullOrWhiteSpace(fromName))
                {
                    return Result<bool>.Fail(StatusCodes.Status500InternalServerError, new[] { "Brevo configuration is missing in appsettings." });
                }

                var requestBody = new
                {
                    sender = new
                    {
                        name = fromName,
                        email = fromEmail
                    },
                    to = new[]
                    {
                        new { email = toEmail }
                    },
                    subject = subject,
                    htmlContent = message
                };

                var json = JsonSerializer.Serialize(requestBody);

                using var request = new HttpRequestMessage(HttpMethod.Post, BrevoEndpoint);
                request.Headers.Add("api-key", apiKey);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                request.Content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    return Result<bool>.Success(200, true);
                }

                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Brevo API Error while sending email to {Email}: {Error}", toEmail, error);
                return Result<bool>.Fail(StatusCodes.Status503ServiceUnavailable, new[] { "Failed to send email. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending email with Brevo to {Email}", toEmail);
                return Result<bool>.Fail(StatusCodes.Status500InternalServerError, new[] { "An unexpected error occurred while sending email." });
            }
        }
    }
}
