using ModawantyDAL.ResponseDto;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyDAL.ResponseContracts
{
    public class ArticleResponseAdminV2
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string AuthorName { get; set; }

        public string Content { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryId { get; set; }
        public string Category { get; set; }
        public int? ReadTimeInMiniutes { get; set; }
        public int? Views { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool IsPublished { get; set; }
        public bool IsDeleted { get; set; }

        public List<TagResponse> Tags { get; set; }
        public List<CommentResponse>? Comments { get; set; }
    }
}
