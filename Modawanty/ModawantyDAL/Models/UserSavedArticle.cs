using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModawantyDAL.Models
{
    public class UserSavedArticle
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(ApplicationUser))]
        public string UserId { get; set; }

        [ForeignKey(nameof(Article))]
        public int ArticleId { get; set; }

        public DateTime SavedAt { get; set; }

        // Navigation properties
        public ApplicationUser ApplicationUser { get; set; }
        public Article Article { get; set; }
    }
}
