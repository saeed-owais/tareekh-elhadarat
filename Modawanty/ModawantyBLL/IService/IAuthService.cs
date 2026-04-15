using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;

namespace ModawantyBLL.IService
{
    public interface IAuthService
    {
        Task<Result<bool>> RegisterAsync(RegisterRequest registerRequest, CancellationToken cancellationToken);
        Task<Result<AuthResult>> LoginAsync(LoginRequest loginCredentials, CancellationToken cancellationToken);

        Task<Result<bool>> ChangePasswordAsync(ChangePasswordRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> RequestResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken);
        Task<Result<bool>> ResetPasswordAsync(ResetPassword request, CancellationToken cancellationToken);

        Task<Result<AuthResult>> ConfirmEmail(string userId, string token, CancellationToken cancellationToken);
        Task<Result<bool>> ResendConfirmEmail(string email, CancellationToken cancellationToken);




    }
}
