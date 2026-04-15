using Hangfire;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModawantyBLL.enums;
using ModawantyBLL.Helpers;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseContracts;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.Service
{
    public class ArticleService : IArticleService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IImageService _imageService;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;

        public ArticleService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IImageService imageService, IEmailService emailService, UserManager<ApplicationUser> userManager, IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _imageService = imageService;
            _emailService = emailService;
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
        }

        public async Task<Result<PaginatedResponse<ArticleResponseAdmin>>> GetSubmittedArticles(PaginationRequest paginationRequest, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            // Get total count of unpublished articles (for pagination metadata)
            var totalCount = await _context.Articles
                .Where(e => e.IsPublished == false)
                .CountAsync(cancellationToken);

            // Fetch paginated articles
            var articles = await _context.Articles
                .AsNoTracking()
                .Where(e => e.IsPublished == false)
                .OrderByDescending(e => e.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .ToListAsync(cancellationToken);

            var articleResponses = articles.Select(a => new ArticleResponseAdmin
            {
                Id = a.Id,
                Title = a.Title,
                AuthorName = a.AuthorName,
                Content = a.Content,
                ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                CreatedAt = a.CreatedAt,
            }).ToList();

            var paginatedResponse = new PaginatedResponse<ArticleResponseAdmin>
            {
                Data = articleResponses,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                TotalItems = totalCount
            };

            return Result<PaginatedResponse<ArticleResponseAdmin>>.Success(200, paginatedResponse);
        }
        public async Task<Result<bool>> AcceptArticle(int ArticleId, CancellationToken cancellationToken)
        {
            var article = await _context.Articles.FindAsync(ArticleId, cancellationToken);

            if (article is null)
                return Result<bool>.Fail(404, new string[] { "Article Not Found" });

            article.IsPublished = true;

            _context.Update(article);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }

        public async Task<Result<bool>> CreateArticleUser(ArticleRequestUser article, CancellationToken cancellationToken)
        {
            //check if article with the same title already exists
            var articleExists = await _context.Articles.AnyAsync(a => a.Title == article.Title.Trim(), cancellationToken);
            if (articleExists)
                return Result<bool>.Fail(400, new string[] { "An article with the same title already exists" });


            //Validate category
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == article.CategoryId, cancellationToken);
            if (!categoryExists)
                return Result<bool>.Fail(400, new string[] { "Invalid category ID" });

            //validate tags
            var tagIds = article.ArticleTagsIds;
            var tagsExist = await _context.Tags.Where(t => tagIds.Contains(t.Id)).Select(t => t.Id).ToListAsync();
            if (!tagsExist.Any())
                return Result<bool>.Fail(400, new string[] { "Invalid tag IDs" });

            var invalidTagIds = tagIds.Except(tagsExist).ToList();
            if (invalidTagIds.Any())
                return Result<bool>.Fail(400, new string[] { $"Invalid tag IDs: {string.Join(", ", invalidTagIds)}" });


            //Get current user name from the HttpContext
            var currentUserName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            if (currentUserName == null)
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });

            var user = await _userManager.FindByNameAsync(currentUserName);

            if (user!.AuthorName is null)
                return Result<bool>.Fail(400, new string[] { "please set author name in profile to continue" });


            // Handle image upload
            string featuredImageUrl = "";
            if (article.Image != null && article.Image.Length > 0)
            {
                try
                {
                    featuredImageUrl = await _imageService.UploadImageAsync(article.Image, "articles");
                }
                catch (InvalidOperationException ex)
                {
                    return Result<bool>.Fail(400, new string[] { ex.Message });
                }
            }

            else
                return Result<bool>.Fail(400, new string[] { "Poster is required" });


            var articleEntity = new Article
            {
                Title = article.Title,
                AuthorName = user.AuthorName,
                AuthorId = user.Id,
                Content = article.Content,
                FeaturedImageUrl = featuredImageUrl,
                CreatedAt = DateTime.Now,
                CategoryId = article.CategoryId,
                ArticleTags = tagsExist.Select(tagId => new ArticleTag { TagId = tagId }).ToList(),
                IsPublished = false,
                IsDeleted = false,
                ReadTimeInMiniutes = ReadTimeHelper.CalculateReadTime(article.Content)
            };

            await _context.Articles.AddAsync(articleEntity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            //Notify admin about the new article submission
            var language = GetRequestLanguage();
            BackgroundJob.Enqueue(() => NotifyAdminsOfNewArticleAsync(articleEntity.Id, language, CancellationToken.None));

            return Result<bool>.Success(201, true);
        }
        public async Task<Result<bool>> CreateArticleAdmin(ArticleRequestAdmin article, CancellationToken cancellationToken)
        {
            //check if article with the same title already exists
            var articleExists = await _context.Articles.AnyAsync(a => a.Title == article.Title.Trim(), cancellationToken);
            if (articleExists)
                return Result<bool>.Fail(400, new string[] { "An article with the same title already exists" });


            //Validate category
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == article.CategoryId, cancellationToken);
            if (!categoryExists)
                return Result<bool>.Fail(400, new string[] { "Invalid category ID" });

            //validate tags
            var tagIds = article.ArticleTagsIds;
            var tagsExist = await _context.Tags.Where(t => tagIds.Contains(t.Id)).Select(t => t.Id).ToListAsync();
            if (!tagsExist.Any())
                return Result<bool>.Fail(400, new string[] { "Invalid tag IDs" });

            var invalidTagIds = tagIds.Except(tagsExist).ToList();
            if (invalidTagIds.Any())
                return Result<bool>.Fail(400, new string[] { $"Invalid tag IDs: {string.Join(", ", invalidTagIds)}" });

            // Handle image upload
            string featuredImageUrl = "";
            if (article.Image != null && article.Image.Length > 0)
            {
                try
                {
                    featuredImageUrl = await _imageService.UploadImageAsync(article.Image, "articles");
                }
                catch (InvalidOperationException ex)
                {
                    return Result<bool>.Fail(400, new string[] { ex.Message });
                }
            }

            else
                return Result<bool>.Fail(400, new string[] { "Poster is required" });


            var articleEntity = new Article
            {
                Title = article.Title,
                AuthorName = article.AuthorName,
                AuthorId = null,
                Content = article.Content,
                FeaturedImageUrl = featuredImageUrl,
                CreatedAt = DateTime.Now,
                CategoryId = article.CategoryId,
                ArticleTags = tagsExist.Select(tagId => new ArticleTag { TagId = tagId }).ToList(),
                IsPublished = article.IsPublished,
                ReadTimeInMiniutes = ReadTimeHelper.CalculateReadTime(article.Content)
            };

            _context.Articles.Add(articleEntity);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(201, true);
        }
        public async Task<Result<bool>> EditArticleAdmin(ArticleRequestAdmin article, CancellationToken cancellationToken)
        {
            if (article.Id is null)
                return Result<bool>.Fail(400, new string[] { "Invalid article Id" });

            var articleEntity = await _context.Articles
                .Include(a => a.ArticleTags)
                .FirstOrDefaultAsync(a => a.Id == article.Id, cancellationToken);

            if (articleEntity == null)
                return Result<bool>.Fail(404, new string[] { "Article not found" });

            // Validate title is not empty
            var trimmedTitle = article.Title?.Trim();
            if (string.IsNullOrWhiteSpace(trimmedTitle))
                return Result<bool>.Fail(400, new string[] { "Article title is required" });

            // Check if title already exists for another article
            var titleExists = await _context.Articles
                .AnyAsync(a => a.Id != article.Id && a.Title == trimmedTitle, cancellationToken);
            if (titleExists)
                return Result<bool>.Fail(400, new string[] { "An article with the same title already exists" });

            // Validate category
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == article.CategoryId, cancellationToken);
            if (!categoryExists)
                return Result<bool>.Fail(400, new string[] { "Invalid category ID" });

            // Validate tags
            var tagIds = article.ArticleTagsIds;
            if (!tagIds.Any())
                return Result<bool>.Fail(400, new string[] { "At least one tag is required" });

            var tagsExist = await _context.Tags
                .Where(t => tagIds.Contains(t.Id))
                .Select(t => t.Id)
                .ToListAsync(cancellationToken);

            if (!tagsExist.Any())
                return Result<bool>.Fail(400, new string[] { "Invalid tag IDs" });

            var invalidTagIds = tagIds.Except(tagsExist).ToList();
            if (invalidTagIds.Any())
                return Result<bool>.Fail(400, new string[] { $"Invalid tag IDs: {string.Join(", ", invalidTagIds)}" });

            // Handle image upload
            if (article.Image != null && article.Image.Length > 0)
            {
                try
                {
                    // Upload new image first before deleting old one (safer approach)
                    var newImageUrl = await _imageService.UploadImageAsync(article.Image, "articles");

                    // Delete old image only after successful upload
                    if (!string.IsNullOrEmpty(articleEntity.FeaturedImageUrl))
                        await _imageService.DeleteImageAsync(articleEntity.FeaturedImageUrl);


                    articleEntity.FeaturedImageUrl = newImageUrl;
                }
                catch (InvalidOperationException ex)
                {
                    return Result<bool>.Fail(400, new string[] { ex.Message });
                }
            }

            // Update article entity properties
            articleEntity.Title = trimmedTitle;
            articleEntity.AuthorName = article.AuthorName!.Trim();
            articleEntity.Content = article.Content!.Trim();
            articleEntity.CategoryId = article.CategoryId;
            articleEntity.IsPublished = article.IsPublished;
            articleEntity.UpdatedAt = DateTime.UtcNow;
            articleEntity.ReadTimeInMiniutes = ReadTimeHelper.CalculateReadTime(article.Content!);

            // Update tags - remove old tags and add new ones
            _context.ArticleTags.RemoveRange(articleEntity.ArticleTags);
            foreach (var tagId in tagsExist)
            {
                articleEntity.ArticleTags.Add(new ArticleTag { ArticleId = articleEntity.Id, TagId = tagId });
            }

            // Save changes to database
            _context.Update(articleEntity);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }
        public async Task<Result<bool>> ArticleViewed(int ArticleId, CancellationToken cancellationToken)
        {
            var article = await _context.Articles.FindAsync(ArticleId, cancellationToken);

            if (article == null)
                return Result<bool>.Fail(404, new string[] { "Article not found" });

            if (article.ArticleViews == null)
                article.ArticleViews = 0;

            article.ArticleViews += 1;

            _context.Update(article);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(201, true);
        }
        public async Task<Result<bool>> ToggleArticle(int ArticleId, CancellationToken cancellationToken)
        {
            var article = await _context.Articles.FindAsync(ArticleId, cancellationToken);

            if (article is null)
                return Result<bool>.Fail(404, new string[] { "Article Not Found" });

            article.IsDeleted = !article.IsDeleted;

            _context.Update(article);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }

        public async Task<Result<PaginatedResponse<ArticleResponseAdmin>>> GetAllArticlesAdmin(PaginationRequest paginationRequest, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            // Get total count of all articles (for pagination metadata)
            var totalCount = await _context.Articles
                .CountAsync(cancellationToken);

            // Fetch paginated articles
            var articles = await _context.Articles
                .Include(c => c.Category)
                .AsNoTracking()
                .OrderByDescending(e => e.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .ToListAsync(cancellationToken);

            var articleResponses = articles.Select(a => new ArticleResponseAdmin
            {
                Id = a.Id,
                Title = a.Title,
                AuthorName = a.AuthorName,
                Content = a.Content,
                CategoryId = a.CategoryId,
                Category = a.Category != null ? a.Category.Name : null,
                ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Views = a.ArticleViews ?? 0,
                IsPublished = a.IsPublished,
                IsDeleted = a.IsDeleted,
            }).ToList();

            var paginatedResponse = new PaginatedResponse<ArticleResponseAdmin>
            {
                Data = articleResponses,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                TotalItems = totalCount
            };

            return Result<PaginatedResponse<ArticleResponseAdmin>>.Success(200, paginatedResponse);
        }

        public async Task<Result<PaginatedResponse<ArticleResponseUser>>> GetArticlesByCategory(int CategoryId, PaginationRequest paginationRequest, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            // Get total count of published articles in category (for pagination metadata)
            var totalCount = await _context.Articles
                .Where(a => a.CategoryId == CategoryId && a.IsPublished && !a.IsDeleted)
                .CountAsync(cancellationToken);

            // Fetch paginated articles
            var articles = await _context.Articles
                .Include(article => article.Category)
                .Include(article => article.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.CategoryId == CategoryId && a.IsPublished && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .Select(a => new ArticleResponseUser
                {
                    Id = a.Id,
                    Title = a.Title,
                    AuthorName = a.AuthorName,
                    ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                    Category = a.Category.Name,
                    ReadTimeInMiniutes = a.ReadTimeInMiniutes,
                    Tags = a.ArticleTags.Select(at => at.Tag.Name).ToList()
                }).ToListAsync(cancellationToken);

            var paginatedResponse = new PaginatedResponse<ArticleResponseUser>
            {
                Data = articles,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                TotalItems = totalCount
            };

            return Result<PaginatedResponse<ArticleResponseUser>>.Success(200, paginatedResponse);
        }
        public async Task<Result<PaginatedResponse<ArticleResponseUser>>> SearchByTitle(string title, PaginationRequest paginationRequest, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var searchTerm = title.Trim();

            // Get total count of search results (for pagination metadata)
            var totalCount = await _context.Articles
                .Where(a => EF.Functions.Like(a.Title, $"%{searchTerm}%") && a.IsPublished && !a.IsDeleted)
                .CountAsync(cancellationToken);

            if (totalCount == 0)
                return Result<PaginatedResponse<ArticleResponseUser>>.Fail(404, new string[] { "No articles found matching your search" });

            // Fetch paginated search results
            var articles = await _context.Articles
                .Include(article => article.Category)
                .Include(article => article.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => EF.Functions.Like(a.Title, $"%{searchTerm}%") && a.IsPublished && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .Select(a => new ArticleResponseUser
                {
                    Id = a.Id,
                    Title = a.Title,
                    AuthorName = a.AuthorName,
                    ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                    Category = a.Category.Name,
                    ReadTimeInMiniutes = a.ReadTimeInMiniutes,
                    Tags = a.ArticleTags.Select(at => at.Tag.Name).ToList()
                }).ToListAsync(cancellationToken);

            var paginatedResponse = new PaginatedResponse<ArticleResponseUser>
            {
                Data = articles,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                TotalItems = totalCount
            };

            return Result<PaginatedResponse<ArticleResponseUser>>.Success(200, paginatedResponse);
        }

        public async Task<Result<ArticleResponseUser>> GetSpecialArticle(CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var article = await _context.Articles
                .Include(article => article.Category)
                .Include(article => article.Comments)
                .ThenInclude(e => e.User)
                .Include(article => article.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.IsPublished && !a.IsDeleted)
                .OrderByDescending(a => a.ArticleViews)
                .FirstOrDefaultAsync(cancellationToken);

            if (article == null)
                return Result<ArticleResponseUser>.Fail(404, new string[] { "No special article found" });

            var articleResponse = new ArticleResponseUser
            {
                Id = article.Id,
                Title = article.Title,
                AuthorName = article.AuthorName,
                Content = article.Content,
                ImageUrl = string.IsNullOrEmpty(article.FeaturedImageUrl) ? null : $"{baseUrl}{article.FeaturedImageUrl.TrimStart('/')}",
                Category = article.Category.Name,
                ReadTimeInMiniutes = article.ReadTimeInMiniutes,
                Tags = article.ArticleTags.Select(at => at.Tag.Name).ToList(),
                Comments = article.Comments.Where(i => !i.IsDeleted && i.IsPublished).Select(c => new CommentResponse
                {
                    Id = c.Id,
                    UserName = c.User.UserName!,
                    Text = c.Text,
                    CreatedAt = c.CreatedAt,
                }).ToList() ?? new List<CommentResponse>()
            };

            return Result<ArticleResponseUser>.Success(200, articleResponse);
        }
        public async Task<Result<ArticleResponseUser>> GetArticleUser(int articleId, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var article = await _context.Articles
                .Include(article => article.Category)
                .Include(article => article.Comments)
                .ThenInclude(e => e.User)
                .Include(article => article.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.Id == articleId && a.IsPublished && !a.IsDeleted)
                .Select(a => new ArticleResponseUser
                {
                    Id = a.Id,
                    Title = a.Title,
                    AuthorName = a.AuthorName,
                    Content = a.Content,
                    ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                    Category = a.Category.Name,
                    ReadTimeInMiniutes = a.ReadTimeInMiniutes,
                    Tags = a.ArticleTags.Select(at => at.Tag.Name).ToList(),
                    Comments = a.Comments.Where(i => i.IsPublished && !i.IsDeleted).Select(c => new CommentResponse
                    {
                        Id = c.Id,
                        UserName = c.User.UserName!,
                        Text = c.Text,
                        CreatedAt = c.CreatedAt,
                    }).ToList() ?? new List<CommentResponse>()
                }).FirstOrDefaultAsync(cancellationToken);

            if (article is null)
                return Result<ArticleResponseUser>.Fail(404, new string[] { "Article Not Found" });

            return Result<ArticleResponseUser>.Success(200, article);
        }
        public async Task<Result<ArticleResponseAdminV2>> GetArticleAdmin(int articleId, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var article = await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Include(a => a.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(a => a.Id == articleId, cancellationToken);

            if (article is null)
                return Result<ArticleResponseAdminV2>.Fail(404, new string[] { "Article Not Found" });

            var articleResponse = new ArticleResponseAdminV2
            {
                Id = article.Id,
                Title = article.Title,
                AuthorName = article.AuthorName,
                Content = article.Content,
                ImageUrl = string.IsNullOrEmpty(article.FeaturedImageUrl) ? null : $"{baseUrl}{article.FeaturedImageUrl.TrimStart('/')}",
                CategoryId = article.CategoryId,
                Category = article.Category.Name,
                ReadTimeInMiniutes = article.ReadTimeInMiniutes,
                CreatedAt = article.CreatedAt,
                IsDeleted = article.IsDeleted,
                IsPublished = article.IsPublished,
                Views = article.ArticleViews,
                Tags = article.ArticleTags.Select(at => new TagResponse 
                { 
                    Id = at.Tag.Id, 
                    Name = at.Tag.Name, 
                    IsAvailable = !article.IsDeleted 
                }).ToList(),
                Comments = article.Comments
                    .Where(c => c.IsPublished && !c.IsDeleted)
                    .Select(c => new CommentResponse
                    {
                        Id = c.Id,
                        UserName = c.User.UserName!,
                        Text = c.Text,
                        CreatedAt = c.CreatedAt,
                    })
                    .ToList()
            };

            return Result<ArticleResponseAdminV2>.Success(200, articleResponse);
        }


        public async Task<Result<List<ArticleResponseUser>>> GetNewestArticles(CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var articles = await _context.Articles
                .Include(article => article.Category)
                .Include(article => article.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.IsPublished && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .Take(4)
                .Select(a => new ArticleResponseUser
                {
                    Id = a.Id,
                    Title = a.Title,
                    AuthorName = a.AuthorName,
                    ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                    Category = a.Category.Name,
                    ReadTimeInMiniutes = a.ReadTimeInMiniutes,
                    Views = a.ArticleViews,
                    CreatedAt = a.CreatedAt,
                    Tags = a.ArticleTags.Select(at => at.Tag.Name).ToList()
                })
                .ToListAsync(cancellationToken);

            return Result<List<ArticleResponseUser>>.Success(200, articles);
        }
        public async Task<Result<List<ArticleResponseUser>>> GetMostViewedArticles(CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var articles = await _context.Articles
                .Include(article => article.Category)
                .Include(article => article.ArticleTags)
                .ThenInclude(at => at.Tag)
                .Where(a => a.IsPublished && !a.IsDeleted)
                .OrderByDescending(a => a.ArticleViews)
                .Take(4)
                .Select(a => new ArticleResponseUser
                {
                    Id = a.Id,
                    Title = a.Title,
                    AuthorName = a.AuthorName,
                    ImageUrl = string.IsNullOrEmpty(a.FeaturedImageUrl) ? null : $"{baseUrl}{a.FeaturedImageUrl.TrimStart('/')}",
                    Category = a.Category.Name,
                    ReadTimeInMiniutes = a.ReadTimeInMiniutes,
                    Views = a.ArticleViews,
                    Tags = a.ArticleTags.Select(at => at.Tag.Name).ToList()
                })
                .ToListAsync(cancellationToken);

            return Result<List<ArticleResponseUser>>.Success(200, articles);
        }


        public async Task NotifyAdminsOfNewArticleAsync(int articleId, string language, CancellationToken cancellationToken)
        {
            try
            {
                //Get the article
                var article = await _context.Articles.FindAsync(articleId);

                // Get all users with admin role
                var admins = await _userManager.GetUsersInRoleAsync(DefaultRoles.Admin);

                if (!admins.Any())
                    return;

                // Get article category name
                var category = await _context.Categories.FindAsync(new object[] { article.CategoryId }, cancellationToken: cancellationToken);
                var categoryName = category?.Name ?? "Unknown";

                // Load email template
                var templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplates", $"NewArticleSubmission{GetTemplateSuffix(language)}.html");
                string emailTemplate = await File.ReadAllTextAsync(templatePath, cancellationToken);

                // Replace placeholders with actual values
                var message = emailTemplate
                    .Replace("{{ARTICLE_TITLE}}", article.Title)
                    .Replace("{{ARTICLE_AUTHOR}}", article.AuthorName)
                    .Replace("{{ARTICLE_CATEGORY}}", categoryName)
                    .Replace("{{ARTICLE_DATE}}", article.CreatedAt.ToString("g"))
                    .Replace("{{ADMIN_DASHBOARD_URL}}", $"http://localhost:4200/admin/bending-articles");

                // Prepare email subject
                var subject = language == "ar" ? "مقال جديد بانتظار المراجعة" : "New Article Submission Pending Review";

                // Send email to all admins
                foreach (var admin in admins)
                {
                    if (!string.IsNullOrEmpty(admin.Email))
                    {
                        await _emailService.SendEmailAsync(admin.Email, subject, message, cancellationToken);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception but don't throw - email notification shouldn't fail the article creation
                System.Diagnostics.Debug.WriteLine($"Error notifying admins: {ex.Message}");
            }
        }

        private string GetRequestLanguage()
        {
            var language = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.UICulture.TwoLetterISOLanguageName
                           ?? _httpContextAccessor.HttpContext?.Request.Headers.AcceptLanguage.ToString().Split(',').FirstOrDefault()?.Trim().ToLowerInvariant();

            return language != null && language.StartsWith("ar") ? "ar" : "en";
        }

        private static string GetTemplateSuffix(string language) => language == "ar" ? "Ar" : "En";
    }
}
