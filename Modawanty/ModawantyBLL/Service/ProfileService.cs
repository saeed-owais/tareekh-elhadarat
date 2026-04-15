using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.RequestContracts;
using ModawantyDAL.ResponseContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyBLL.Service
{
    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IImageService _imageService;
        private readonly IConfiguration _configuration;

        public ProfileService(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor, IImageService imageService, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _imageService = imageService;
            _configuration = configuration;
        }
        public async Task<Result<ProfileResponse>> GetProfile(CancellationToken cancellationToken)
        {
            //Get current user name from the HttpContext
            var currentUserName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

            if (currentUserName == null)
                return Result<ProfileResponse>.Fail(401, new string[] { "Unauthorized" });

            var user = await _userManager.FindByNameAsync(currentUserName);

            if (user == null)
                return Result<ProfileResponse>.Fail(401, new string[] { "Unauthorized" });


            var profileResponse = new ProfileResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                UserName = user.UserName!,
                AuthorName = user.AuthorName,
                Bio = user.Bio,
            };

            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            if (user.ProfilePhoto != null)
                profileResponse.ProfilePhoto = $"{baseUrl}{user.ProfilePhoto.TrimStart('/')}";


            return Result<ProfileResponse>.Success(200, profileResponse);
        }
        public async Task<Result<bool>> EditProfile(ProfileRequest profileRequest, CancellationToken cancellationToken)
        {
            //Get current user name from the HttpContext
            var currentUserName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

            if (currentUserName == null)
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });

            var user = await _userManager.FindByNameAsync(currentUserName);

            if (user == null || user.Id != profileRequest.UserId)
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });


            string ProfileImageUrl = "";
            if (profileRequest.ProfilePhoto != null && profileRequest.ProfilePhoto.Length > 0)
            {
                try
                {
                    ProfileImageUrl = await _imageService.UploadImageAsync(profileRequest.ProfilePhoto, "Users");
                }
                catch (InvalidOperationException ex)
                {
                    return Result<bool>.Fail(400, new string[] { ex.Message });
                }
            }

            user.FirstName = profileRequest.FirstName;
            user.LastName = profileRequest.LastName;
            user.AuthorName = profileRequest.AuthorName;
            user.ProfilePhoto = ProfileImageUrl;
            user.Bio = profileRequest.Bio?.Trim();

            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }


        public async Task<Result<List<SavedArticlesResponse>>> GetSavedArticles(CancellationToken cancellationToken)
        {
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst("userId")?.Value;

            if (currentUserId is null)
                return Result<List<SavedArticlesResponse>>.Fail(401, new string[] { "Unauthorized" });

            var savedArticles = await _context.UserSavedArticles
                .Where(usa => usa.UserId == currentUserId && !usa.Article.IsDeleted)
                .OrderByDescending(usa => usa.SavedAt)
                .Select(usa => new SavedArticlesResponse
                {
                    Id = usa.Id,
                    ArticleId = usa.ArticleId,
                    Title = usa.Article.Title,
                    Category = usa.Article.Category.Name
                })
                .ToListAsync(cancellationToken);

            return Result<List<SavedArticlesResponse>>.Success(200, savedArticles);
        }
        public async Task<Result<bool>> SaveArticle(int articleId, CancellationToken cancellationToken)
        {
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst("userId")?.Value;

            if (currentUserId is null)
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });

            var article = await _context.Articles.FindAsync(articleId, cancellationToken);

            if (article is null)
                return Result<bool>.Fail(400, new string[] { "article not found" });

            if (article.IsDeleted)
                return Result<bool>.Fail(400, new string[] { "deleted article" });

            var AlreadySaved = await _context.UserSavedArticles
                .AnyAsync(usa => usa.UserId == currentUserId && usa.ArticleId == articleId, cancellationToken);

            if (AlreadySaved)
                return Result<bool>.Fail(400, new string[] { "Article already saved" });


            var savedArticle = new UserSavedArticle
            {
                UserId = currentUserId,
                ArticleId = articleId,
                SavedAt = DateTime.Now
            };

            await _context.AddAsync(savedArticle, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }
        public async Task<Result<bool>> RemoveSavedArticle(int articleId, CancellationToken cancellationToken)
        {
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst("userId")?.Value;

            if (currentUserId is null)
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });

            var savedArticle = await _context.UserSavedArticles
                .FirstOrDefaultAsync(usa => usa.UserId == currentUserId && usa.ArticleId == articleId, cancellationToken);

            if (savedArticle is not null)
            {
                _context.Remove(savedArticle);
                await _context.SaveChangesAsync(cancellationToken);
            }

            return Result<bool>.Success(200, true);
        }
    }
}
