using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModawantyAPI.Configuration;
using ModawantyBLL.enums;
using ModawantyBLL.IService;
using ModawantyDAL.RequestContracts;
using ModawantyDAL.RequestDto;

namespace ModawantyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : LocalizedControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _bookService = bookService;
        }

        [HttpPost]
        [Route("Add-Book-Admin")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> AddBookAdmin([FromForm] BookRequest bookRequest, CancellationToken cancellationToken)
        {
            var result = await _bookService.AddBookAdmin(bookRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return StatusCode(result.StatusCode, new { message = L("Book added successfully"), data = result.Data });
        }

        [HttpDelete]
        [Route("Delete-Book")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> DeleteBookAdmin([FromQuery] int bookId, CancellationToken cancellationToken)
        {
            var result = await _bookService.DeleteBookAdmin(bookId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(new { message = L("Book deleted successfully") });
        }

        [HttpGet]
        [Route("Get-All-Admin")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> GetAllBooksAdmin([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _bookService.GetAllBooksAdmin(paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Get-All-User")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllBooksUser([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _bookService.GetAllBooksUser(paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }

        [HttpGet]
        [Route("Search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchByTitle([FromQuery] string title, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var paginationRequest = new PaginationRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _bookService.SearchByTitle(title, paginationRequest, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }


        [HttpGet]
        [Route("Get-Book-Details")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookDetails([FromQuery] int BookId, CancellationToken cancellationToken)
        {
            var result = await _bookService.GetBookDetails(BookId, cancellationToken);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

            return Ok(result.Data);
        }
    }
}
