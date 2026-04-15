using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;
using ModawantyBLL.enums;
using ModawantyBLL.IService;

namespace ModawantyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : LocalizedControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet]
        [Route("users-number")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetUsersNumber(CancellationToken cancellationToken)
        {
            var result = await _statisticsService.GetUsersNumber(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpGet]
        [Route("articles-number")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetArticlesNumber(CancellationToken cancellationToken)
        {
            var result = await _statisticsService.GetArticlesNumber(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpGet]
        [Route("books-number")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetBooksNumber(CancellationToken cancellationToken)
        {
            var result = await _statisticsService.GetBooksNumber(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpGet]
        [Route("comments-number")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetCommentsNumber(CancellationToken cancellationToken)
        {
            var result = await _statisticsService.GetCommentsNumber(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
            return Ok(result);
        }

        [HttpGet]
        [Route("views-number")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetViewsNumber(CancellationToken cancellationToken)
        {
            var result = await _statisticsService.GetViewsNumber(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }

        [HttpGet]
        [Route("most-viewed-articles")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> MostViewedArticles(CancellationToken cancellationToken)
        {
            var result = await _statisticsService.MostViewedArticles(cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result);
        }
    }
}