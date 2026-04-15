using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ModawantyBLL.IService;
using ModawantyDAL.Contracts;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.Service
{
    public class PdfUploadR2Service : IPdfUploadService
    {
        private const long MaxFileSizeBytes = 50 * 1024 * 1024;
        private const string AllowedMimeType = "application/pdf";
        private const string AllowedExtension = ".pdf";
        private const string FolderName = "books";

        private readonly CloudflareR2Settings _settings;
        private readonly IAmazonS3 _s3Client;
        private readonly ILogger<PdfUploadR2Service> _logger;

        public PdfUploadR2Service(IOptions<CloudflareR2Settings> options, ILogger<PdfUploadR2Service> logger)
        {
            _settings = options.Value;
            _logger = logger;

            ValidateConfiguration(_settings);

            var s3Config = new AmazonS3Config
            {
                ServiceURL = _settings.Endpoint,
                ForcePathStyle = true,
                AuthenticationRegion = "auto"
            };

            _s3Client = new AmazonS3Client(_settings.AccessKey, _settings.SecretKey, s3Config);
        }

        public async Task<PdfUploadResult> UploadPdfAsync(IFormFile file, string? fileName = null, CancellationToken cancellationToken = default)
        {
            ValidateFile(file);

            var key = BuildObjectKey(fileName, file.FileName);

            try
            {
                var request = new PutObjectRequest
                {
                    BucketName = _settings.BucketName,
                    Key = key,
                    InputStream = file.OpenReadStream(),
                    ContentType = file.ContentType,
                    AutoCloseStream = true,
                    UseChunkEncoding = false
                };

                request.Headers.ContentLength = file.Length;

                var response = await _s3Client.PutObjectAsync(request, cancellationToken);

                if (response.HttpStatusCode is not (System.Net.HttpStatusCode.OK or System.Net.HttpStatusCode.NoContent))
                    throw new InvalidOperationException($"Upload failed with status code {response.HttpStatusCode}");

                return new PdfUploadResult
                {
                    PublicId = key,
                    DownloadUrl = BuildDownloadUrl(key)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading PDF to R2. Bucket: {Bucket}, Key: {Key}", _settings.BucketName, key);
                throw new InvalidOperationException("Failed to upload PDF to Cloudflare R2.", ex);
            }
        }

        public async Task<bool> DeletePdfAsync(string publicId, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(publicId))
                return false;

            try
            {
                try
                {
                    await _s3Client.GetObjectMetadataAsync(_settings.BucketName, publicId, cancellationToken);
                }
                catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return false;
                }

                var response = await _s3Client.DeleteObjectAsync(_settings.BucketName, publicId, cancellationToken);
                return response.HttpStatusCode is System.Net.HttpStatusCode.OK or System.Net.HttpStatusCode.NoContent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting PDF from R2. Bucket: {Bucket}, Key: {Key}", _settings.BucketName, publicId);
                return false;
            }
        }

        private static void ValidateConfiguration(CloudflareR2Settings settings)
        {
            if (string.IsNullOrWhiteSpace(settings.AccessKey) ||
                string.IsNullOrWhiteSpace(settings.SecretKey) ||
                string.IsNullOrWhiteSpace(settings.BucketName) ||
                string.IsNullOrWhiteSpace(settings.Endpoint))
            {
                throw new InvalidOperationException("Cloudflare R2 settings are missing. Please configure Cloudflare:R2 in appsettings.");
            }
        }

        private static void ValidateFile(IFormFile file)
        {
            if (file is null || file.Length == 0)
                throw new InvalidOperationException("File cannot be null or empty.");

            if (file.Length > MaxFileSizeBytes)
                throw new InvalidOperationException("File size exceeds the maximum allowed size of 50 MB.");

            if (!file.ContentType.Equals(AllowedMimeType, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("Invalid file type. Only PDF files are allowed.");

            var extension = Path.GetExtension(file.FileName);
            if (!extension.Equals(AllowedExtension, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("Invalid file extension. Only .pdf files are allowed.");
        }

        private static string BuildObjectKey(string? fileName, string originalFileName)
        {
            var sourceName = string.IsNullOrWhiteSpace(fileName)
                ? Path.GetFileNameWithoutExtension(originalFileName)
                : fileName;

            var normalized = sourceName.Trim().Replace(" ", "-");
            return $"{FolderName}/{normalized}-{Guid.NewGuid():N}.pdf";
        }

        private string BuildDownloadUrl(string key)
        {
            if (!string.IsNullOrWhiteSpace(_settings.PublicBaseUrl))
                return $"{_settings.PublicBaseUrl.TrimEnd('/')}/{key}";

            return $"{_settings.Endpoint.TrimEnd('/')}/{_settings.BucketName}/{key}";
        }
    }
}
