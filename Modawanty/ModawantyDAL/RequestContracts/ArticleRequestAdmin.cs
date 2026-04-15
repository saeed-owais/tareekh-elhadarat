using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.RequestDto
{
    public class ArticleRequestAdmin
    {
        public int? Id { get; set; }

        [MaxLength(250)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string AuthorName { get; set; }

        [MaxLength(30000)]
        public string Content { get; set; }

        public bool IsPublished { get; set; }

        public IFormFile? Image { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public List<int> ArticleTagsIds { get; set; }
    }
}
