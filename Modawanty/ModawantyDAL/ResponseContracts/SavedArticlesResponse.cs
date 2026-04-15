using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyDAL.ResponseContracts
{
    public class SavedArticlesResponse
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
    }
}
