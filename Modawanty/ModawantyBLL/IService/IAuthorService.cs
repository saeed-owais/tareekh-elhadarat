using ModawantyDAL.Models;
using ModawantyDAL.ResponseContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyBLL.IService
{
    public interface IAuthorService
    {
        Task<Result<List<AuthorResponse>>> GetTopAuthors(CancellationToken cancellationToken);
    }
}
