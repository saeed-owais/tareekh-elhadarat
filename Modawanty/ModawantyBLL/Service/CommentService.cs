using Hangfire;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModawantyBLL.Helpers;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.Service
{
    public class CommentService : ICommentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;

        public CommentService(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor,
            IEmailService emailService,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment webHostEnvironment,
            IConfiguration configuration)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
        }

        public async Task<Result<bool>> AcceptCommentAsync(int commentId, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments.FindAsync(commentId, cancellationToken);

            if (comment == null || comment.IsDeleted)
                return Result<bool>.Fail(404, new string[] { "Comment not found" });

            //Publish Comment
            comment.IsPublished = true;

            _context.Comments.Update(comment);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }

        public async Task<Result<bool>> AddCommentAsync(CommentRequest comment, CancellationToken cancellationToken)
        {
            // Get current user ID from the HttpContext
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst("userId")?.Value;

            if (currentUserId == null)
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });

            // Verify the user making the request matches the comment's UserId
            if (currentUserId != comment.UserId.Trim())
                return Result<bool>.Fail(401, new string[] { "Unauthorized" });

            // Validate article exists and is published
            var articleExists = await _context.Articles
                .AnyAsync(a => a.Id == comment.ArticleId && a.IsPublished && !a.IsDeleted, cancellationToken);

            if (!articleExists)
                return Result<bool>.Fail(404, new string[] { "Article not found or is not published" });

            // Validate user exists
            var userExists = await _userManager.FindByIdAsync(currentUserId);
            if (userExists == null)
                return Result<bool>.Fail(401, new string[] { "User not found" });

            var newComment = new Comment()
            {
                Text = comment.Content.Trim(),
                ArticleId = comment.ArticleId,
                UserId = currentUserId,
                CreatedAt = DateTime.Now,
                IsDeleted = false,
                IsPublished = false
            };

            await _context.AddAsync(newComment, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Notify admins about the new comment
            var language = GetRequestLanguage();
            BackgroundJob.Enqueue(() => NotifyAdminsOfNewCommentAsync(newComment.Id, newComment.ArticleId, userExists, language));


            return Result<bool>.Success(201, true);
        }

        public async Task<Result<bool>> DeleteCommentAsync(int commentId, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments.FindAsync(commentId, cancellationToken);

            if (comment == null || comment.IsDeleted)
                return Result<bool>.Fail(404, new string[] { "Comment not found" });

            // Soft delete the comment
            comment.IsDeleted = true;

            _context.Comments.Update(comment);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }

        public async Task<Result<CommentResponseAdmin>> GetCommentByIdAsync(int commentId, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Article)
                .Where(c => !c.IsDeleted)
                .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

            if (comment == null)
                return Result<CommentResponseAdmin>.Fail(404, new string[] { "Comment not found" });

            var commentResponse = new CommentResponseAdmin()
            {
                Id = comment.Id,
                UserName = comment.User?.UserName!,
                ArticleTitle = comment.Article?.Title!,
                ArticleId = comment.Id,
                Text = comment.Text,
                CreatedAt = comment.CreatedAt,
                IsPublished = comment.IsPublished
            };

            return Result<CommentResponseAdmin>.Success(200, commentResponse);
        }

        public async Task<Result<List<CommentResponseAdmin>>> GetSubmittedCommentsAsync(CancellationToken cancellationToken)
        {
            var comments = await _context.Comments
                .Where(c => !c.IsDeleted && !c.IsPublished)
                .Select(c => new CommentResponseAdmin()
                {
                    Id = c.Id,
                    UserName = c.User!.UserName!,
                    ArticleTitle = c.Article!.Title!,
                    ArticleId = c.ArticleId,
                    Text = c.Text,
                    CreatedAt = c.CreatedAt,
                    IsPublished = c.IsPublished,
                })
                .ToListAsync(cancellationToken);

            return Result<List<CommentResponseAdmin>>.Success(200, comments);
        }


        public async Task NotifyAdminsOfNewCommentAsync(int commentId, int articleId, ApplicationUser commenter, string language)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Article)
                .FirstOrDefaultAsync(c => c.Id == commentId);

            var article = await _context.Articles
                .Include(a => a.Category)
                .FirstOrDefaultAsync(a => a.Id == comment!.ArticleId);

            // Get all users with Admin role
            var admins = await _userManager.GetUsersInRoleAsync("Admin");

            if (!admins.Any())
                return;

            // Load email template
            var templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplates", $"NewCommentNotification{GetTemplateSuffix(language)}.html");

            if (!File.Exists(templatePath))
            {
                System.Diagnostics.Debug.WriteLine($"Email template not found at: {templatePath}");
                return;
            }

            string emailTemplate = await File.ReadAllTextAsync(templatePath);

            // Replace placeholders with actual values
            var message = emailTemplate
                .Replace("{{ARTICLE_TITLE}}", article.Title)
                .Replace("{{ARTICLE_ID}}", article.Id.ToString())
                .Replace("{{COMMENTER_NAME}}", commenter.UserName)
                .Replace("{{COMMENTER_EMAIL}}", commenter.Email)
                .Replace("{{COMMENT_TEXT}}", SecurityHelper.HtmlEncode(comment.Text))
                .Replace("{{COMMENT_DATE}}", comment.CreatedAt.ToString("g"))
                .Replace("{{COMMENT_ID}}", comment.Id.ToString())
                .Replace("{{ARTICLE_CATEGORY}}", article.Category?.Name ?? "Unknown")
                .Replace("{{ADMIN_DASHBOARD_URL}}", $"{_configuration["FrontEnd:BaseUrl"]}/admin/comments")
                .Replace("{{ARTICLE_URL}}", $"{_configuration["FrontEnd:BaseUrl"]}/articles/{article.Id}");

            // Prepare email subject
            var subject = language == "ar" ? $"تعليق جديد على المقال: {article.Title}" : $"New Comment on Article: {article.Title}";

            // Send email to all admins
            foreach (var admin in admins)
            {
                if (!string.IsNullOrEmpty(admin.Email))
                {
                    await _emailService.SendEmailAsync(admin.Email, subject, message, CancellationToken.None);
                }
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
