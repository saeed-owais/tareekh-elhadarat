using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.ResponseContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyBLL.Service
{
    public class AuthorService : IAuthorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthorService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Result<List<AuthorResponse>>> GetTopAuthors(CancellationToken cancellationToken)
        {
            // Get top 4 author names by published article count
            var topAuthorNames = await _context.Articles
                .Where(a => a.IsPublished && !a.IsDeleted)
                .GroupBy(a => a.AuthorName)
                .OrderByDescending(g => g.Count())
                .Take(4)
                .Select(g => g.Key)
                .ToListAsync(cancellationToken);

            if (topAuthorNames.Count == 0)
                return Result<List<AuthorResponse>>.Fail(404, new[] { "No authors found." });

            // Get author details from Users table
            var authors = await _context.Users
                .Where(u => topAuthorNames.Contains(u.AuthorName!))
                .Select(u => new AuthorResponse
                {
                    Name = u.AuthorName!,
                    Bio = u.Bio!,
                    ProfilePhoto = u.ProfilePhoto
                })
                .ToListAsync(cancellationToken);

            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            // Concatenate base URL with profile photo
            foreach (var author in authors)
            {
                if (!string.IsNullOrEmpty(author.ProfilePhoto))
                    author.ProfilePhoto = $"{baseUrl}{author.ProfilePhoto.TrimStart('/')}";
            }

            return Result<List<AuthorResponse>>.Success(200, authors);
        }
    }
}
