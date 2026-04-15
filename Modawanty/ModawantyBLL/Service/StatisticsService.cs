using Microsoft.EntityFrameworkCore;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.ResponseDto;
using System;

namespace ModawantyBLL.Service
{
    public class StatisticsService : IStatisticsService
    {
        private readonly ApplicationDbContext _context;

        public StatisticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int>> GetArticlesNumber(CancellationToken cancellationToken)
        {
            var articlesNumber = await _context.Articles
                .Where(a => !a.IsDeleted && a.IsPublished)
                .CountAsync(cancellationToken);

            return Result<int>.Success(200, articlesNumber);
        }

        public async Task<Result<int>> GetBooksNumber(CancellationToken cancellationToken)
        {
            var booksNumber = await _context.Books
                .Where(b => !b.IsDeleted)
                .CountAsync(cancellationToken);

            return Result<int>.Success(200, booksNumber);
        }

        public async Task<Result<int>> GetCommentsNumber(CancellationToken cancellationToken)
        {
            var commentsNumber = await _context.Comments
                .Where(c => !c.IsDeleted && c.IsPublished)
                .CountAsync(cancellationToken);

            return Result<int>.Success(200, commentsNumber);
        }

        public async Task<Result<int>> GetUsersNumber(CancellationToken cancellationToken)
        {
            var usersNumber = await _context.Users.CountAsync(cancellationToken);

            return Result<int>.Success(200, usersNumber);
        }

        public async Task<Result<int>> GetViewsNumber(CancellationToken cancellationToken)
        {
            var viewsNumber = await _context.Articles
                .Where(a => !a.IsDeleted && a.IsPublished)
                .SumAsync(a => a.ArticleViews, cancellationToken);

            return Result<int>.Success(200, viewsNumber ?? 0);
        }

        public async Task<Result<List<ArticleResponseAdmin>>> MostViewedArticles(CancellationToken cancellationToken)
        {
            var mostViewedArticles = await _context.Articles
                .Where(a => !a.IsDeleted && a.IsPublished)
                .OrderByDescending(a => a.ArticleViews)
                .Take(4)
                .Select(a => new ArticleResponseAdmin
                {
                    Id = a.Id,
                    Title = a.Title,
                    Views = a.ArticleViews ?? 0,
                    AuthorName = a.AuthorName,
                })
                .ToListAsync(cancellationToken);

            return Result<List<ArticleResponseAdmin>>.Success(200, mostViewedArticles);
        }
    }
}
