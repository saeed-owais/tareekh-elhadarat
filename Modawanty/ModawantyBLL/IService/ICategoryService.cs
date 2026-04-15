using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.IService
{
    public interface ICategoryService
    {
        Task<Result<bool>> AddCategoryAsync(CategoryRequest categoryRequest, CancellationToken cancellationToken);
        Task<Result<bool>> UpdateCategoryAsync(CategoryRequest categoryRequest, CancellationToken cancellationToken);
        Task<Result<bool>> ToggleCategoryAsync(int Id, CancellationToken cancellationToken);

        Task<Result<List<CategoryResponse>>> GetAllCategoriesAsync(CancellationToken cancellationToken);
        Task<Result<CategoryResponse>> GetCategoryByIdAsync(int id, CancellationToken cancellationToken);
        Task<Result<CategoryResponse>> GetCategoryByNameAsync(string name, CancellationToken cancellationToken);

    }
}
