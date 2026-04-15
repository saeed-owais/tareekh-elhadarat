using ModawantyDAL.Models;
using ModawantyDAL.RequestContracts;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseContracts;

namespace ModawantyBLL.IService
{
    public interface IBookService
    {
        Task<Result<bool>> AddBookAdmin(BookRequest bookRequest, CancellationToken cancellation);
        Task<Result<bool>> DeleteBookAdmin(int BookId, CancellationToken cancellation);

        Task<Result<PaginatedResponse<BookResponse>>> GetAllBooksAdmin(PaginationRequest paginationRequest, CancellationToken cancellationToken);
        Task<Result<PaginatedResponse<BookResponse>>> GetAllBooksUser(PaginationRequest paginationRequest, CancellationToken cancellation);
        Task<Result<PaginatedResponse<BookResponse>>> SearchByTitle(string Title, PaginationRequest paginationRequest, CancellationToken cancellation);
        Task<Result<BookResponse>> GetBookDetails(int Id, CancellationToken cancellation);
    }
}
