using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;
using ModawantyBLL.enums;
using ModawantyBLL.IService;
using ModawantyDAL.RequestDto;

namespace ModawantyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : LocalizedControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _tagService = tagService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAllTags(CancellationToken cancellationToken)
        {
            var result = await _tagService.GetAllTagsAsync(cancellationToken);

            if (result.IsSuccess)
                return Ok(result.Data);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }

        [HttpPost]
        [Route("Add-Tag")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> AddTag([FromBody] TagRequest tagRequest, CancellationToken cancellationToken)
        {
            var result = await _tagService.AddTagAsync(tagRequest, cancellationToken);

            if (result.IsSuccess)
                return StatusCode(result.StatusCode);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }

        [HttpPost]
        [Route("Update-Tag")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> UpdateTag([FromBody] TagRequest tagRequest, CancellationToken cancellationToken)
        {
            var result = await _tagService.UpdateTagAsync(tagRequest, cancellationToken);

            if (result.IsSuccess)
                return StatusCode(result.StatusCode);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }

        [HttpPost]
        [Route("Toggle-Tag/{id}")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> ToggleTag([FromRoute] int id, CancellationToken cancellationToken)
        {
            var result = await _tagService.ToggleTagAsync(id, cancellationToken);

            if (result.IsSuccess)
                return StatusCode(result.StatusCode);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }
    }
}
