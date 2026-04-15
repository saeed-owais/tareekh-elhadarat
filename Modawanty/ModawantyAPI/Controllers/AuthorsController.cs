using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;
using ModawantyBLL.IService;

namespace ModawantyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : LocalizedControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorsController(IAuthorService authorService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _authorService = authorService;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("Get-Top-Authors")]
        public async Task<IActionResult> GetTopAuthors(CancellationToken cancellationToken)
        {
            var result = await _authorService.GetTopAuthors(cancellationToken);

            if (result.IsSuccess)
                return Ok(result.Data);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }
    }
}
