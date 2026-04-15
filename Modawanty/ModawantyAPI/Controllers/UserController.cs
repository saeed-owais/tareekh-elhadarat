using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;
using ModawantyBLL.IService;
using ModawantyDAL.RequestContracts;
using ModawantyDAL.RequestDto;

namespace ModawantyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : LocalizedControllerBase
    {
        private readonly IProfileService _profileService;

        public UserController(IProfileService profileService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _profileService = profileService;
        }

        [HttpGet]
        [Route("Get-Profile")]
        [Authorize]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            var result = await _profileService.GetProfile(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Edit-Profile")]
        [Authorize]
        public async Task<IActionResult> Edit([FromForm] ProfileRequest profileRequest, CancellationToken cancellationToken)
        {
            var result = await _profileService.EditProfile(profileRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-Saved-Articles")]
        [Authorize]
        public async Task<IActionResult> GetSavedArticles(CancellationToken cancellationToken)
        {
            var result = await _profileService.GetSavedArticles(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Save-Article")]
        [Authorize]
        public async Task<IActionResult> SaveArticle([FromQuery] int articleId, CancellationToken cancellationToken)
        {
            var result = await _profileService.SaveArticle(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Remove-Saved-Article")]
        [Authorize]
        public async Task<IActionResult> RemoveArticle([FromQuery] int articleId, CancellationToken cancellationToken)
        {
            var result = await _profileService.RemoveSavedArticle(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

       
    }
}
