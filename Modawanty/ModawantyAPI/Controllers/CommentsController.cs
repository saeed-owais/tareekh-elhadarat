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
    public class CommentsController : LocalizedControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _commentService = commentService;
        }

        [HttpPost]
        [Route("add-comment")]
        [Authorize]
        public async Task<IActionResult> AddComment([FromBody] CommentRequest comment, CancellationToken cancellationToken)
        {
            var result = await _commentService.AddCommentAsync(comment, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("delete-comment")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> DeleteComment([FromQuery] int commentId, CancellationToken cancellationToken)
        {
            var result = await _commentService.DeleteCommentAsync(commentId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("get-comment")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetComment([FromQuery] int commentId, CancellationToken cancellationToken)
        {
            var result = await _commentService.GetCommentByIdAsync(commentId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("get-submitted-comments")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetSubmittedComments(CancellationToken cancellationToken)
        {
            var result = await _commentService.GetSubmittedCommentsAsync(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("accept-comment")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> AcceptComment([FromQuery] int commentId, CancellationToken cancellationToken)
        {
            var result = await _commentService.AcceptCommentAsync(commentId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }
    }
}

