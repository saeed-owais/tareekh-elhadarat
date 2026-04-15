using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.RequestContracts;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseContracts;
using ModawantyDAL.ResponseDto;
using System.Net;

namespace ModawantyBLL.Service
{
    public class BookService : IBookService
    {
        private readonly ApplicationDbContext _context;
        private readonly IImageService _imageService;
        private readonly IPdfUploadService _pdfUploadService;
        private readonly IConfiguration _configuration;
        public BookService(
            ApplicationDbContext context,
            IImageService imageService,
            IPdfUploadService pdfUploadService,
            IConfiguration configuration)
        {
            _context = context;
            _imageService = imageService;
            _pdfUploadService = pdfUploadService;
            _configuration = configuration;
        }

        public async Task<Result<bool>> AddBookAdmin(BookRequest bookRequest, CancellationToken cancellationToken)
        {
            // Check if book with same title already exists
            var bookexist = await _context.Books.FirstOrDefaultAsync(b => b.Title == bookRequest.Title.Trim(), cancellationToken);

            if (bookexist is not null)
                return Result<bool>.Fail(400, new string[] { "Book with same title already exist" });

            // Validate poster is provided
            if (bookRequest.Poster == null || bookRequest.Poster.Length == 0)
                return Result<bool>.Fail(400, new string[] { "Book poster is required" });

            // Validate book PDF is provided
            if (bookRequest.Book == null || bookRequest.Book.Length == 0)
                return Result<bool>.Fail(400, new string[] { "Book PDF file is required" });

            // Handle poster upload
            var posterUrl = await _imageService.UploadImageAsync(bookRequest.Poster, "books");

            //Handle book PDF upload to Cloudinary
            PdfUploadResult? pdfUploadResult = null;
            try
            {
                pdfUploadResult = await _pdfUploadService.UploadPdfAsync(bookRequest.Book, bookRequest.Title, cancellationToken);
            }
            catch (InvalidOperationException ex)
            {
                // If PDF upload fails, delete the already uploaded poster
                await _imageService.DeleteImageAsync(posterUrl!);
                return Result<bool>.Fail(400, new string[] { ex.Message });
            }

            var book = new Book
            {
                Title = bookRequest.Title.Trim(),
                Author = bookRequest.Author.Trim(),
                PageCount = bookRequest.PageCount,
                ReleaseDate = bookRequest.ReleaseDate,
                About = bookRequest.About.Trim(),
                Poster = posterUrl!,
                DownloadLink = pdfUploadResult.DownloadUrl,
                SaveLocation = pdfUploadResult.PublicId,
                CreatedAt = DateTime.Now,
                IsDeleted = false,
            };

            await _context.Books.AddAsync(book, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(201, true);
        }
        public async Task<Result<bool>> DeleteBookAdmin(int bookId, CancellationToken cancellationToken)
        {
            var book = await _context.Books.FindAsync(new object[] { bookId }, cancellationToken: cancellationToken);

            if (book == null)
                return Result<bool>.Fail(404, new[] { "Book not found" });


            // Use SaveLocation (public ID) to delete PDF from Cloudinary
            BackgroundJob.Enqueue(() => _pdfUploadService.DeletePdfAsync(book.SaveLocation, cancellationToken));

            // Delete poster from local storage
            await _imageService.DeleteImageAsync(book.Poster);

            //delete the book
            _context.Books.Remove(book);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(200, true);
        }

        public async Task<Result<PaginatedResponse<BookResponse>>> GetAllBooksAdmin(PaginationRequest paginationRequest, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var totalCount = await _context.Books
                .Where(b => !b.IsDeleted)
                .CountAsync(cancellationToken);

            var books = await _context.Books
                .Where(b => !b.IsDeleted)
                .OrderByDescending(b => b.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .Select(b => new BookResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    PageCount = b.PageCount,
                    ReleaseDate = b.ReleaseDate,
                    About = null,
                    Poster = $"{baseUrl}{b.Poster.TrimStart('/')}",
                    DownloadLink = b.DownloadLink
                })
                .ToListAsync(cancellationToken);

            return Result<PaginatedResponse<BookResponse>>.Success(200,
                new PaginatedResponse<BookResponse>
                {
                    Data = books,
                    PageNumber = paginationRequest.PageNumber,
                    PageSize = paginationRequest.PageSize,
                    TotalItems = totalCount
                });
        }
        public async Task<Result<PaginatedResponse<BookResponse>>> GetAllBooksUser(PaginationRequest paginationRequest, CancellationToken cancellationToken)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var totalCount = await _context.Books
                .Where(b => !b.IsDeleted)
                .CountAsync(cancellationToken);

            var books = await _context.Books
                .Where(b => !b.IsDeleted)
                .OrderByDescending(b => b.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .Select(b => new BookResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    PageCount = b.PageCount,
                    ReleaseDate = b.ReleaseDate,
                    About = null,
                    Poster = $"{baseUrl}{b.Poster.TrimStart('/')}",
                    DownloadLink = b.DownloadLink
                })
                .ToListAsync(cancellationToken);

            return Result<PaginatedResponse<BookResponse>>.Success(200,
                new PaginatedResponse<BookResponse>
                {
                    Data = books,
                    PageNumber = paginationRequest.PageNumber,
                    PageSize = paginationRequest.PageSize,
                    TotalItems = totalCount
                });
        }
        public async Task<Result<BookResponse>> GetBookDetails(int Id, CancellationToken cancellationToken)
        {
            var book = await _context.Books.Where(b => b.Id == Id && !b.IsDeleted)
                .Select(b => new BookResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    PageCount = b.PageCount,
                    ReleaseDate = b.ReleaseDate,
                    About = b.About,
                    Poster = $"{_configuration["Api:DevelopmnentUrl"]}{b.Poster.TrimStart('/')}",
                    DownloadLink = b.DownloadLink
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (book is null)
                return Result<BookResponse>.Fail(404, new string[] { "Book not found" });

            return Result<BookResponse>.Success(200, book);
        }

        public async Task<Result<PaginatedResponse<BookResponse>>> SearchByTitle(string Title, PaginationRequest paginationRequest, CancellationToken cancellation)
        {
            var baseUrl = _configuration["Api:DevelopmnentUrl"];

            var searchTerm = Title.Trim();

            // Get total count of search results (for pagination metadata)
            var totalCount = await _context.Books
                .Where(b => EF.Functions.Like(b.Title, $"%{searchTerm}%") && !b.IsDeleted)
                .CountAsync(cancellation);

            if (totalCount == 0)
                return Result<PaginatedResponse<BookResponse>>.Fail(404, new string[] { "No books found matching your search" });

            // Fetch paginated search results
            var books = await _context.Books
                .Where(b => EF.Functions.Like(b.Title, $"%{searchTerm}%") && !b.IsDeleted)
                .OrderByDescending(b => b.CreatedAt)
                .Skip(paginationRequest.Skip)
                .Take(paginationRequest.PageSize)
                .Select(b => new BookResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    PageCount = b.PageCount,
                    ReleaseDate = b.ReleaseDate,
                    About = b.About,
                    Poster = $"{baseUrl}{b.Poster.TrimStart('/')}",
                    DownloadLink = b.DownloadLink
                })
                .ToListAsync(cancellation);

            var paginatedResponse = new PaginatedResponse<BookResponse>
            {
                Data = books,
                PageNumber = paginationRequest.PageNumber,
                PageSize = paginationRequest.PageSize,
                TotalItems = totalCount
            };

            return Result<PaginatedResponse<BookResponse>>.Success(200, paginatedResponse);
        }
    }
}
