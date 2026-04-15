using ModawantyDAL.Models;

namespace ModawantyBLL.IService
{
    public interface IEmailService
    {
        Task<Result<bool>> SendEmailAsync(string toEmail, string subject, string message, CancellationToken cancellationToken);
    }
}
