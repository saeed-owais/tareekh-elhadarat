using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.IService
{
    public interface ITagService
    {
        Task<Result<bool>> AddTagAsync(TagRequest tagRequest, CancellationToken cancellationToken);
        Task<Result<bool>> UpdateTagAsync(TagRequest tagRequest, CancellationToken cancellationToken);
        Task<Result<bool>> ToggleTagAsync(int Id, CancellationToken cancellationToken);

        Task<Result<List<TagResponse>>> GetAllTagsAsync(CancellationToken cancellationToken);

    }
}
