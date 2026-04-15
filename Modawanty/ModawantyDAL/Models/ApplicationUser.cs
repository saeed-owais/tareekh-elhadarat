using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.Models
{
    public class ApplicationUser : IdentityUser
    {
        [MinLength(3)]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [MinLength(3)]
        [MaxLength(50)]
        public string LastName { get; set; }

        [MaxLength(150)]
        public string? AuthorName { get; set; }

        [MaxLength(500)]
        public string? ProfilePhoto { get; set; }

        [MaxLength(1000)]
        public string? Bio { get; set; }

        // Navigation property for saved articles
        public ICollection<UserSavedArticle> SavedArticles { get; set; } = new List<UserSavedArticle>();
    }
}
