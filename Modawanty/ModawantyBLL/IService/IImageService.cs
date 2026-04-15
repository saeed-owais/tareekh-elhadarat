using Microsoft.AspNetCore.Http;

namespace ModawantyBLL.IService
{
    public interface IImageService
    {

        Task<string?> UploadImageAsync(IFormFile file, string folder = "images");

        (bool isValid, string? errorMessage) ValidateImage(IFormFile file, int maxSizeInMb = 3);

        Task DeleteImageAsync(string relativePath);
    }
}
