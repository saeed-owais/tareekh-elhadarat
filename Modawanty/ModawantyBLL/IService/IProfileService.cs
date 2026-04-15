using Microsoft.AspNetCore.Http.HttpResults;
using ModawantyDAL.Models;
using ModawantyDAL.RequestContracts;
using ModawantyDAL.ResponseContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyBLL.IService
{
    public interface IProfileService
    {
        Task<Result<ProfileResponse>> GetProfile(CancellationToken cancellationToken);
        Task<Result<bool>> EditProfile(ProfileRequest profileRequest, CancellationToken cancellationToken);

        Task<Result<List<SavedArticlesResponse>>> GetSavedArticles(CancellationToken cancellationToken);
        Task<Result<bool>> SaveArticle(int articleId, CancellationToken cancellationToken);
        Task<Result<bool>> RemoveSavedArticle(int articleId, CancellationToken cancellationToken);
    }
}
