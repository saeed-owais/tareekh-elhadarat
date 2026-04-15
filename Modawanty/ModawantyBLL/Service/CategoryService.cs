using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<List<CategoryResponse>>> GetAllCategoriesAsync(CancellationToken cancellationToken)
        {
            var Categories = await _context.Categories.Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                IsAvailable = c.IsAvailable
            }).AsNoTracking().ToListAsync(cancellationToken);

            return Result<List<CategoryResponse>>.Success(StatusCodes.Status200OK, Categories);
        }
        public async Task<Result<CategoryResponse>> GetCategoryByIdAsync(int id, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category is null)
                return Result<CategoryResponse>.Fail(StatusCodes.Status404NotFound, new[] { "Category not found" });

            var categoryResponse = new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                IsAvailable = category.IsAvailable
            };

            return Result<CategoryResponse>.Success(StatusCodes.Status200OK, categoryResponse);
        }
        public async Task<Result<CategoryResponse>> GetCategoryByNameAsync(string name, CancellationToken cancellationToken)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Name.ToLower() == name.Trim().ToLower());

            if (category is null)
                return Result<CategoryResponse>.Fail(StatusCodes.Status404NotFound, new[] { "Category not found" });

            var categoryResponse = new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                IsAvailable = category.IsAvailable
            };

            return Result<CategoryResponse>.Success(StatusCodes.Status200OK, categoryResponse);
        }


        public async Task<Result<bool>> AddCategoryAsync(CategoryRequest categoryRequest, CancellationToken cancellationToken)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == categoryRequest.Name
                .Trim()
                .ToLower()
                , cancellationToken);

            if (categoryExists)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Category already exists" });

            var category = new Category
            {
                Name = categoryRequest.Name.Trim(),
                IsAvailable = categoryRequest.IsAvailable
            };

            await _context.Categories.AddAsync(category, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(StatusCodes.Status201Created, true);
        }
        public async Task<Result<bool>> UpdateCategoryAsync(CategoryRequest Request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FindAsync(Request.Id);

            if (category == null)
                return Result<bool>.Fail(StatusCodes.Status404NotFound, new[] { "Category not found" });

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == Request.Name
                .Trim()
                .ToLower() && c.Id != Request.Id, cancellationToken);

            if (categoryExists)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Category name already exists" });

            category.Name = Request.Name.Trim();
            category.IsAvailable = Request.IsAvailable;

            _context.Update(category);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }
        public async Task<Result<bool>> ToggleCategoryAsync(int Id, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FindAsync(Id);

            if (category == null)
                return Result<bool>.Fail(StatusCodes.Status404NotFound, new[] { "Category not found" });

            category.IsAvailable = !category.IsAvailable;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }

    }
}
