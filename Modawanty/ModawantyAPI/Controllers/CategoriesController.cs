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
    public class CategoriesController : LocalizedControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService, ExceptionMessageLocalizer localizer)
            : base(localizer)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _categoryService.GetAllCategoriesAsync(cancellationToken);

            if (result.IsSuccess)
                return Ok(result.Data);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> GetById([FromRoute] int id, CancellationToken cancellationToken)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id, cancellationToken);

            if (result.IsSuccess)
                return Ok(result.Data);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }

        [HttpGet]
        [Route("Get-By-Name")]
        public async Task<IActionResult> GetByName([FromQuery] string name, CancellationToken cancellationToken)
        {
            var result = await _categoryService.GetCategoryByNameAsync(name, cancellationToken);

            if (result.IsSuccess)
                return Ok(result.Data);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }


        [HttpPost]
        [Route("Add-Category")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> AddCategory([FromBody] CategoryRequest categoryRequest, CancellationToken cancellationToken)
        {
            var result = await _categoryService.AddCategoryAsync(categoryRequest, cancellationToken);

            if (result.IsSuccess)
                return StatusCode(result.StatusCode);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }

        [HttpPost]
        [Route("Update-Category")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> UpdateCategory([FromBody] CategoryRequest categoryRequest, CancellationToken cancellationToken)
        {
            var result = await _categoryService.UpdateCategoryAsync(categoryRequest, cancellationToken);

            if (result.IsSuccess)
                return StatusCode(result.StatusCode);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));

        }

        [HttpPost]
        [Route("Toggle-Category/{id}")]
        [Authorize(Roles = DefaultRoles.Admin)]
        public async Task<IActionResult> ToggleCategory([FromRoute] int id, CancellationToken cancellationToken)
        {
            var result = await _categoryService.ToggleCategoryAsync(id, cancellationToken);

            if (result.IsSuccess)
                return StatusCode(result.StatusCode);

            return StatusCode(result.StatusCode, LocalizeErrors(result.Errors));
        }
    }
}
