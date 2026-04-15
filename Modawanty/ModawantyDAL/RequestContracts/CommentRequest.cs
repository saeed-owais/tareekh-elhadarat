using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.RequestDto
{
    public class CommentRequest
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int ArticleId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; }
    }
}
