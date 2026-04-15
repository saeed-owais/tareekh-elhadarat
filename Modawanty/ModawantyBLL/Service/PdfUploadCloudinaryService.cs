using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ModawantyBLL.IService;
using ModawantyDAL.Contracts;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.Service
{
    /// <summary>
    /// Service for uploading and managing PDF files to Cloudinary
    /// Handles validation, upload, and deletion of PDF documents
    /// </summary>
    public class PdfUploadCloudinaryService : IPdfUploadService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<PdfUploadCloudinaryService> _logger;

        // Configuration constants
        private const long MaxFileSizeBytes = 15 * 1024 * 1024; // 15 MB
        private const string AllowedMimeType = "application/pdf";
        private const string AllowedExtension = ".pdf";
        private const string CloudinaryFolder = "modawanty/books"; // Organized folder structure

   
        public PdfUploadCloudinaryService(IOptions<CloudinarySettings> cloudinarySettings, ILogger<PdfUploadCloudinaryService> logger)
        {
            _logger = logger;

            var settings = cloudinarySettings.Value;
            var account = new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }


        public async Task<PdfUploadResult> UploadPdfAsync(IFormFile file, string? fileName = null, CancellationToken cancellationToken = default)
        {
            // Validate file exists
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("PDF upload attempted with null or empty file");
                throw new InvalidOperationException("File cannot be null or empty");
            }

            // Validate file size (15 MB limit)
            if (file.Length > MaxFileSizeBytes)
            {
                _logger.LogWarning($"PDF file too large: {file.FileName} ({file.Length} bytes, max: {MaxFileSizeBytes} bytes)");
                throw new InvalidOperationException($"File size exceeds maximum allowed size of 15 MB. Current size: {FormatFileSize(file.Length)}");
            }

            // Validate MIME type
            if (!file.ContentType.Equals(AllowedMimeType, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning($"Invalid PDF MIME type: {file.ContentType} for file {file.FileName}");
                throw new InvalidOperationException($"Invalid file type. Only PDF files are allowed. Received: {file.ContentType}");
            }

            // Validate file extension
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!fileExtension.Equals(AllowedExtension, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning($"Invalid file extension: {fileExtension} for file {file.FileName}");
                throw new InvalidOperationException($"Invalid file extension. Only .pdf files are allowed. Received: {fileExtension}");
            }

            try
            {
                // Generate public ID for organized storage
                var publicId = string.IsNullOrWhiteSpace(fileName)
                    ? $"{CloudinaryFolder}/{Guid.NewGuid()}"
                    : $"{CloudinaryFolder}/{fileName.Trim().Replace(" ", "_")}_{Guid.NewGuid()}";

                // Upload to Cloudinary using streaming for better performance
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new RawUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        PublicId = publicId,
                        Overwrite = false, // Prevent accidental overwrites
                        Tags = "book-pdf",
                    };

                    _logger.LogInformation($"Uploading PDF to Cloudinary: {file.FileName} (Size: {FormatFileSize(file.Length)})");

                    var uploadResult = await Task.Run(() => _cloudinary.UploadAsync(uploadParams), cancellationToken);

                    if (uploadResult.Error != null)
                    {
                        _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                        throw new InvalidOperationException($"Failed to upload PDF to cloud storage: {uploadResult.Error.Message}");
                    }

                    _logger.LogInformation($"Successfully uploaded PDF: {file.FileName} to public ID: {publicId}");

                    // Return both the secure URL (HTTPS) and public ID
                    var url = uploadResult.SecureUrl?.ToString();
                    if (string.IsNullOrEmpty(url))
                        url = uploadResult.Url?.ToString();

                    return new PdfUploadResult
                    {
                        DownloadUrl = url ?? "",
                        PublicId = publicId
                    };
                }
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("PDF upload was cancelled");
                throw new InvalidOperationException("PDF upload was cancelled");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error uploading PDF: {ex.Message}", ex);
                throw new InvalidOperationException("An unexpected error occurred while uploading the PDF. Please try again.", ex);
            }
        }

        public async Task<bool> DeletePdfAsync(string publicId, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(publicId))
                return false; // No public ID provided, nothing to delete

            var resourcePath = publicId + ".pdf";

            var deleteParams = new DeletionParams(resourcePath)
            {
                ResourceType = ResourceType.Raw,
            };

            var deleteResult = await Task.Run(() => _cloudinary.DestroyAsync(deleteParams), cancellationToken);

            // Check for explicit error
            if (deleteResult.Result.ToLower() == "notfound")
                return false; // File not found, treat as already deleted

            return true;
        }

        private static string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }
    }
}
