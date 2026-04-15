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
    public class ArticlesController : LocalizedControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _articleService = articleService;
        }

        [HttpGet]
        [Route("Get-Submitted-Articles")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetSubmittedArticles([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _articleService.GetSubmittedArticles(paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Add-Article-User")]
        [Authorize(Roles = DefaultRoles.Member)]
        public async Task<IActionResult> AddArticleUser([FromForm] ArticleRequestUser article, CancellationToken cancellationToken)
        {
            var result = await _articleService.CreateArticleUser(article, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Add-Article-Admin")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> AddArticleAdmin([FromForm] ArticleRequestAdmin article, CancellationToken cancellationToken)
        {
            var result = await _articleService.CreateArticleAdmin(article, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-Articles/{categoryid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetArticlesByCategory([FromRoute] int categoryid, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _articleService.GetArticlesByCategory(categoryid, paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Search-Articles")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchArticlesByTitle([FromQuery] string title, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _articleService.SearchByTitle(title, paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Article-viewed")]
        [AllowAnonymous]
        public async Task<IActionResult> ArticleViewed([FromQuery] int articleId, CancellationToken cancellationToken)
        {
            var result = await _articleService.ArticleViewed(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-Special-Article")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSpecialArticle(CancellationToken cancellationToken)
        {
            var result = await _articleService.GetSpecialArticle(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);

        }

        [HttpGet]
        [Route("Get-Newest-Article")]
        [AllowAnonymous]
        public async Task<IActionResult> GetNewestArticles(CancellationToken cancellationToken)
        {
            var result = await _articleService.GetNewestArticles(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-Most-Viewed-Article")]
        [AllowAnonymous]
        public async Task<IActionResult> GetMostViewedArticles(CancellationToken cancellationToken)
        {
            var result = await _articleService.GetMostViewedArticles(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-Article/{articleId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetArticleUser([FromRoute] int articleId, CancellationToken cancellationToken)
        {
            var result = await _articleService.GetArticleUser(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-Article-Admin/{articleId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetArticleAdmin([FromRoute] int articleId, CancellationToken cancellationToken)
        {
            var result = await _articleService.GetArticleAdmin(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Toggle-Article/{articleId}")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> ToggleArticle([FromRoute] int articleId, CancellationToken cancellationToken)
        {
            var result = await _articleService.ToggleArticle(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-All-Articles-Admin")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetAllArticlesAdmin([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _articleService.GetAllArticlesAdmin(paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpPost]
        [Route("Edit-Article-Admin")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> EditArticleAdmin([FromForm] ArticleRequestAdmin article, CancellationToken cancellationToken)
        {
            var result = await _articleService.EditArticleAdmin(article, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);

        }

        [HttpPost]
        [Route("Accept-Article")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> AcceptArticle([FromQuery] int articleId, CancellationToken cancellationToken)
        {
            var result = await _articleService.AcceptArticle(articleId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.Errors);

            return Ok(result.Data);
        }
    }
}