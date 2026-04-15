using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.IService
{
    public interface ICommentService
    {
        Task<Result<bool>> AddCommentAsync(CommentRequest comment, CancellationToken cancellationToken);
        Task<Result<bool>> DeleteCommentAsync(int commentId, CancellationToken cancellationToken);
        Task<Result<CommentResponseAdmin>> GetCommentByIdAsync(int commentId, CancellationToken cancellationToken);
        Task<Result<List<CommentResponseAdmin>>> GetSubmittedCommentsAsync(CancellationToken cancellationToken);

        Task<Result<bool>> AcceptCommentAsync(int commentId, CancellationToken cancellationToken);
    }
}
