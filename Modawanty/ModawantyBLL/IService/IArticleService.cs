using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseContracts;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.IService
{
    public interface IArticleService
    {
        Task<Result<PaginatedResponse<ArticleResponseAdmin>>> GetSubmittedArticles(PaginationRequest paginationRequest, CancellationToken cancellationToken);
        Task<Result<PaginatedResponse<ArticleResponseAdmin>>> GetAllArticlesAdmin(PaginationRequest paginationRequest, CancellationToken cancellationToken);
        Task<Result<bool>> CreateArticleAdmin(ArticleRequestAdmin article, CancellationToken cancellationToken);
        Task<Result<bool>> EditArticleAdmin(ArticleRequestAdmin article, CancellationToken cancellationToken);
        Task<Result<bool>> ToggleArticle(int ArticleId, CancellationToken cancellationToken);
        Task<Result<bool>> ArticleViewed(int ArticleId, CancellationToken cancellationToken);
        Task<Result<bool>> AcceptArticle(int ArticleId, CancellationToken cancellationToken);


        Task<Result<bool>> CreateArticleUser(ArticleRequestUser article, CancellationToken cancellationToken);
        Task<Result<PaginatedResponse<ArticleResponseUser>>> SearchByTitle(string title, PaginationRequest paginationRequest, CancellationToken cancellationToken);
        Task<Result<PaginatedResponse<ArticleResponseUser>>> GetArticlesByCategory(int CategoryId, PaginationRequest paginationRequest, CancellationToken cancellationToken);
        Task<Result<ArticleResponseUser>> GetSpecialArticle(CancellationToken cancellationToken);
        Task<Result<List<ArticleResponseUser>>> GetNewestArticles(CancellationToken cancellationToken);
        Task<Result<List<ArticleResponseUser>>> GetMostViewedArticles(CancellationToken cancellationToken);
        Task<Result<ArticleResponseUser>> GetArticleUser(int articleId, CancellationToken cancellationToken);
        Task<Result<ArticleResponseAdminV2>> GetArticleAdmin(int articleId, CancellationToken cancellationToken);

    }
}
