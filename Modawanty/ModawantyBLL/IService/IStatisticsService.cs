using ModawantyDAL.Models;
using ModawantyDAL.ResponseDto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyBLL.IService
{
    public interface IStatisticsService
    {
        Task<Result<int>> GetUsersNumber(CancellationToken cancellationToken);
        Task<Result<int>> GetArticlesNumber(CancellationToken cancellationToken);
        Task<Result<int>> GetBooksNumber(CancellationToken cancellationToken);
        Task<Result<int>> GetCommentsNumber(CancellationToken cancellationToken);
        Task<Result<int>> GetViewsNumber(CancellationToken cancellationToken);
        Task<Result<List<ArticleResponseAdmin>>> MostViewedArticles(CancellationToken cancellationToken);

    }
}
