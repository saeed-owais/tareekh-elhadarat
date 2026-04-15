using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using ModawantyBLL.IService;

namespace ModawantyBLL.Service
{
    public class ImageService : IImageService
    {
        private readonly string _wwwrootPath;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private readonly string[] _allowedMimeTypes =
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        public ImageService(IWebHostEnvironment environment)
        {
            _wwwrootPath = environment.WebRootPath ?? throw new InvalidOperationException("WebRootPath is not configured");
        }

        public (bool isValid, string? errorMessage) ValidateImage(IFormFile file, int maxSizeInMb = 15)
        {
            if (file == null || file.Length == 0)
                return (false, "File is empty or null");

            // Check MIME type
            if (!_allowedMimeTypes.Contains(file.ContentType?.ToLower()))
                return (false, $"Invalid file format. Allowed formats: JPG, JPEG, PNG, WebP");

            // Check file extension
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            if (!_allowedExtensions.Contains(fileExtension))
                return (false, $"Invalid file extension. Allowed extensions: {string.Join(", ", _allowedExtensions)}");

            // Check file size
            var maxSizeInBytes = maxSizeInMb * 1024 * 1024;
            if (file.Length > maxSizeInBytes)
                return (false, $"File size exceeds the maximum allowed size of {maxSizeInMb}MB");

            return (true, null);
        }

        public async Task<string?> UploadImageAsync(IFormFile file, string folder = "images")
        {
            // Validate image
            var (isValid, errorMessage) = ValidateImage(file);
            if (!isValid)
                throw new InvalidOperationException(errorMessage);

            try
            {
                // Create folder path
                var folderPath = Path.Combine(_wwwrootPath, folder);
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(folderPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return relative URL path
                var relativePath = $"/{folder}/{fileName}";
                return relativePath;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error uploading image: {ex.Message}", ex);
            }
        }

        public async Task DeleteImageAsync(string relativePath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(relativePath))
                    return;

                // Remove leading slash if present
                var cleanPath = relativePath.TrimStart('/');
                var filePath = Path.Combine(_wwwrootPath, cleanPath);

                // Security check: ensure the file is within wwwroot
                var fullWwwrootPath = Path.GetFullPath(_wwwrootPath);
                var fullFilePath = Path.GetFullPath(filePath);

                if (!fullFilePath.StartsWith(fullWwwrootPath))
                    throw new InvalidOperationException("Invalid file path");

                if (File.Exists(fullFilePath))
                    File.Delete(fullFilePath);

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error deleting image: {ex.Message}", ex);
            }
        }
    }
}
