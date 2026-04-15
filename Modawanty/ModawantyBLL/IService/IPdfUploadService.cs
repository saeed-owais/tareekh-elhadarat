using Microsoft.AspNetCore.Http;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.IService
{

    public interface IPdfUploadService
    {

        Task<PdfUploadResult> UploadPdfAsync(IFormFile file, string? fileName = null, CancellationToken cancellationToken = default);

        Task<bool> DeletePdfAsync(string publicId, CancellationToken cancellationToken = default);
    }
}
