using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ModawantyBLL.enums;
using ModawantyBLL.IService;
using ModawantyDAL.Contracts;
using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ModawantyBLL.Service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> RoleManager, IOptions<JwtSettings> options, IHttpContextAccessor contextAccessor, IConfiguration config, IEmailService emailService, IConfiguration configuration)
        {
            _jwtSettings = options.Value;
            _userManager = userManager;
            _roleManager = RoleManager;
            _contextAccessor = contextAccessor;
            _config = config;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<Result<bool>> RegisterAsync(RegisterRequest registerCredentials, CancellationToken cancellationToken)
        {
            var CheckExist = await _userManager.FindByEmailAsync(registerCredentials.Email);

            if (CheckExist is not null)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Email already registered" });

            var CheckUserExist = await _userManager.FindByNameAsync(registerCredentials.UserName);

            if (CheckUserExist is not null)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "UserName already registered" });

            var user = new ApplicationUser()
            {
                FirstName = registerCredentials.FirstName,
                LastName = registerCredentials.LastName,
                UserName = registerCredentials.UserName,
                Email = registerCredentials.Email
            };

            var result = await _userManager.CreateAsync(user, registerCredentials.Password);

            if (!result.Succeeded)
            {
                List<string> errors = new();

                foreach (var error in result.Errors)
                    errors.Add(error.Description);

                return Result<bool>.Fail(StatusCodes.Status400BadRequest, errors.ToArray());
            }

            var addtoRoleResult = await _userManager.AddToRoleAsync(user, DefaultRoles.Member);

            if (!addtoRoleResult.Succeeded)
            {
                var errors = addtoRoleResult.Errors.Select(e => e.Description).ToArray();
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, errors);
            }

            //Send Confirmation Email
            var language = GetRequestLanguage();
            BackgroundJob.Enqueue(() => sendConfirmEmailAsync(user.Id, language, CancellationToken.None));

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }

        public async Task<Result<AuthResult>> LoginAsync(LoginRequest loginCredentials, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(loginCredentials.Email);

            if (user is null)
                return Result<AuthResult>.Fail(StatusCodes.Status400BadRequest, new[] { "Invalid email or password" });

            //if (await _userManager.IsLockedOutAsync(user))
            //    return Result<AuthResult>.Fail(StatusCodes.Status400BadRequest, new[] { "Account locked due to multiple failed login attempts. Try again later." });

            var isValidCredentials = await _userManager.CheckPasswordAsync(user, loginCredentials.Password);

            if (!isValidCredentials)
            {
                // await _userManager.AccessFailedAsync(user); // Increase failed attempts
                return Result<AuthResult>.Fail(StatusCodes.Status401Unauthorized, new[] { "Invalid email or password" });
            }

            //if (!user.EmailConfirmed)
            //    return Result<AuthResult>
            //        .Fail(StatusCodes.Status403Forbidden, new[] { "Email not confirmed. Please confirm your email in order to signin" });

            // If login successful, reset the failed attempts
            await _userManager.ResetAccessFailedCountAsync(user);

            var jwtToken = await GenerateJWTtoken(user);

            var authResult = new AuthResult()
            {
                JwtToken = jwtToken.Token,
                ExpiryAt = jwtToken.ExpiryAt
            };

            return Result<AuthResult>.Success(StatusCodes.Status200OK, authResult);
        }

        private async Task<JwtTokenResult> GenerateJWTtoken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Fetch user roles
            var userRoles = await _userManager.GetRolesAsync(user);

            // Fetch direct user claims (if any)
            var userClaims = await _userManager.GetClaimsAsync(user);

            // Collect all claims from the roles the user has
            var roleClaims = new List<Claim>();
            foreach (var roleName in userRoles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null) continue;

                var claimsForRole = await _roleManager.GetClaimsAsync(role);
                roleClaims.AddRange(claimsForRole);
            }

            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            // Core claims
            var claims = new List<Claim>
              {
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim("profilePhoto",$"{baseUrl}{user.ProfilePhoto?.TrimStart('/')}"),
                new Claim("userId", user.Id)
              };

            // Add role claim only if user has roles
            if (userRoles.Any())
            {
                claims.Add(new Claim(ClaimTypes.Role, userRoles.First()));
            }

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                signingCredentials: SigningCredentials,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes)
            );

            var tokenResult = new JwtTokenResult()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiryAt = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes)
            };

            return tokenResult;
        }

        public async Task<Result<bool>> ChangePasswordAsync(ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            var email = _contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email);

            if (email is null)
                return Result<bool>.Fail(StatusCodes.Status401Unauthorized, new[] { "Unauthorized user" });

            var user = await _userManager.FindByEmailAsync(email);

            if (user is null)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Invalid email or password" });

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Result<bool>.Fail(StatusCodes.Status403Forbidden, new[] { "Email must be confirmed before changing password" });

            var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                var errorlist = new List<string>();

                foreach (var error in result.Errors)
                    errorlist.Add(error.Description);

                return Result<bool>.Fail(StatusCodes.Status400BadRequest, errorlist.ToArray());
            }

            return Result<bool>.Success(StatusCodes.Status200OK, result.Succeeded);
        }


        public async Task<Result<bool>> RequestResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return Result<bool>.Fail(StatusCodes.Status404NotFound, new[] { "User not found" });

            //Send Reset Password Email
            var language = GetRequestLanguage();
            BackgroundJob.Enqueue(() => sendResetPasswordEmailAsync(user.Id, language, CancellationToken.None));

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }
        public async Task<Result<bool>> ResetPasswordAsync(ResetPassword request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user is null)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Invalid or expired reset request" });

            string decodedToken;
            try
            {
                decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
            }
            catch (FormatException ex)
            {
                //_logger.LogError(ex.Message, "Invalid token from user:{Email}", user.Email);

                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Invalid token format" });
            }

            var resetResult = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

            if (!resetResult.Succeeded)
            {
                var errors = resetResult.Errors.Select(e => e.Description).ToArray();
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, errors);
            }

            //_logger.LogInformation("User {Email} successfully reset their password.", user.Email);

            //Get ip and deviceInfo
            var ip = _contextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
            var deviceInfo = _contextAccessor.HttpContext?.Request.Headers["User-Agent"].ToString();
            var language = GetRequestLanguage();

            BackgroundJob.Enqueue(() => SendPasswordResetSuccessEmailAsync(user.Id, ip!, deviceInfo!, language, CancellationToken.None));

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }


        public async Task<Result<AuthResult>> ConfirmEmail(string UserId, string Token, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(UserId);

            if (user is null)
                return Result<AuthResult>.Fail(StatusCodes.Status400BadRequest, new[] { "Invalid user/token" });

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(Token));

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
            {
                return Result<AuthResult>.Fail(StatusCodes.Status400BadRequest, new[] { "Invalid user/token" });
            }

            var jwtToken = await GenerateJWTtoken(user);

            var authResult = new AuthResult()
            {
                JwtToken = jwtToken.Token,
                ExpiryAt = jwtToken.ExpiryAt
            };

            return Result<AuthResult>.Success(StatusCodes.Status200OK, authResult);
        }
        public async Task<Result<bool>> ResendConfirmEmail(string email, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return Result<bool>.Fail(StatusCodes.Status404NotFound, new[] { "User not found" });

            if (await _userManager.IsEmailConfirmedAsync(user))
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Email already confirmed" });

            //Send Confirmation Email
            //_jobClient.Enqueue(() => sendConfirmEmailAsync(user.Id, CancellationToken.None));

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }

        //Handle frontend url
        public async Task<Result<bool>> sendConfirmEmailAsync(string userId, string language, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId);

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user!);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var frontEndUrl = _config["FrontEnd:BaseUrl"];
            var confirmationUrl = $"{frontEndUrl}/confirm-email?userId={user!.Id}&token={encodedToken}";

            // Get the absolute path to wwwroot
            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            // Build the path to the template file
            var templatePath = Path.Combine(webRootPath, "EmailTemplates", $"ConfirmEmail{GetTemplateSuffix(language)}.html");

            // Read the HTML file
            var htmlBody = await File.ReadAllTextAsync(templatePath, cancellationToken);

            //Replace placeholders
            htmlBody = htmlBody
                .Replace("{{UserName}}", user.UserName ?? "User")
                .Replace("{{ConfirmationUrl}}", confirmationUrl);

            var emailResponse = await _emailService.SendEmailAsync(
                user.Email!,
                language == "ar" ? "تأكيد حسابك في مدونتي" : "Confirm your Modawanty account",
                htmlBody,
                cancellationToken
            );

            if (!emailResponse.IsSuccess)
                return Result<bool>.Fail(emailResponse.StatusCode, emailResponse.Errors!);

            return Result<bool>.Success(emailResponse.StatusCode, emailResponse.Data);
        }
        public async Task<Result<bool>> sendResetPasswordEmailAsync(string userId, string language, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var frontEndUrl = _config["FrontEnd:BaseUrl"];
            var confirmationUrl = $"{frontEndUrl}/reset-password?userId={user.Id}&token={encodedToken}";

            // Get the absolute path to wwwroot
            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            // Build the path to the template file
            var templatePath = Path.Combine(webRootPath, "EmailTemplates", $"ResetPassword{GetTemplateSuffix(language)}.html");

            // Read the HTML file
            var htmlBody = await File.ReadAllTextAsync(templatePath, cancellationToken);

            //Replace placeholders
            htmlBody = htmlBody
                .Replace("{{UserName}}", user.UserName ?? "User")
                .Replace("{{ResetPasswordUrl}}", confirmationUrl);

            var emailResponse = await _emailService.SendEmailAsync(
                user.Email!,
                language == "ar" ? "طلب إعادة تعيين كلمة مرور حساب مدونتي" : "Request-Reset your Modawanty account password",
                htmlBody,
                cancellationToken
            );

            if (!emailResponse.IsSuccess)
                return Result<bool>.Fail(emailResponse.StatusCode, emailResponse.Errors!);

            return Result<bool>.Success(emailResponse.StatusCode, emailResponse.Data);
        }
        public async Task<Result<bool>> SendPasswordResetSuccessEmailAsync(string userId, string ipAddress, string deviceInfo, string language, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId);

            var frontEndUrl = _config["FrontEnd:BaseUrl"];
            var loginUrl = $"{frontEndUrl}/login";

            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var templatePath = Path.Combine(webRootPath, "EmailTemplates", $"PasswordResetSuccess{GetTemplateSuffix(language)}.html");

            var htmlBody = await File.ReadAllTextAsync(templatePath, cancellationToken);

            htmlBody = htmlBody
                .Replace("{{UserName}}", user.UserName)
                .Replace("{{UserEmail}}", user.Email)
                .Replace("{{LoginUrl}}", loginUrl)
                .Replace("{{ResetDateTime}}", DateTime.UtcNow.ToString("f") + " UTC")
                .Replace("{{IPAddress}}", ipAddress ?? "Unknown")
                .Replace("{{DeviceInfo}}", deviceInfo ?? "Unknown");

            // Step 5: Send email
            var emailResponse = await _emailService.SendEmailAsync(
                user.Email!,
                language == "ar" ? "تمت إعادة تعيين كلمة مرور مدونتي بنجاح ✅" : "Your Modawanty Password Has Been Reset Successfully ✅",
                htmlBody,
                cancellationToken
            );

            if (!emailResponse.IsSuccess)
                return Result<bool>.Fail(emailResponse.StatusCode, emailResponse.Errors!);

            return Result<bool>.Success(emailResponse.StatusCode, emailResponse.Data);
        }

        private string GetRequestLanguage()
        {
            var language = _contextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.UICulture.TwoLetterISOLanguageName
                           ?? _contextAccessor.HttpContext?.Request.Headers.AcceptLanguage.ToString().Split(',').FirstOrDefault()?.Trim().ToLowerInvariant();

            return language != null && language.StartsWith("ar") ? "ar" : "en";
        }

        private static string GetTemplateSuffix(string language) => language == "ar" ? "Ar" : "En";

    }
}
