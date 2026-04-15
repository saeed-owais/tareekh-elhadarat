using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModawantyDAL.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [ForeignKey("Article")]
        public int ArticleId { get; set; }
        public Article Article { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Text { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public bool IsPublished { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
