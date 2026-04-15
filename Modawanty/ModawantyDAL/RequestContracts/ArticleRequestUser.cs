using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.RequestDto
{
    public class ArticleRequestUser
    {
        [MaxLength(250)]
        public string Title { get; set; }

        [MaxLength(30000)]
        public string Content { get; set; }

        [Required]
        public IFormFile Image { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public List<int> ArticleTagsIds { get; set; }
    }
}
