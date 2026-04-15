using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;
using ModawantyBLL.IService;
using ModawantyDAL.RequestDto;

namespace ModawantyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : LocalizedControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _authService = authService;
        }

        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerCredentials, CancellationToken cancellationToken)
        {
            var result = await _authService.RegisterAsync(registerCredentials, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> login([FromBody] LoginRequest loginCredentials, CancellationToken cancellationToken)
        {
            var result = await _authService.LoginAsync(loginCredentials, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }


        [HttpPost]
        [Route("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.ChangePasswordAsync(request, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpPost]
        [Route("request-reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> RequestResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.RequestResetPasswordAsync(request, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpPost]
        [Route("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword request, CancellationToken cancellationToken)
        {
            var result = await _authService.ResetPasswordAsync(request, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpPost]
        [Route("confirm-email")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token, CancellationToken cancellationToken)
        {
            var result = await _authService.ConfirmEmail(userId, token, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpPost("resend-confirmation")]
        [AllowAnonymous]
        public async Task<IActionResult> ResendConfirmation([FromQuery] string email, CancellationToken cancellationToken)
        {
            var result = await _authService.ResendConfirmEmail(email, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

    }
}
