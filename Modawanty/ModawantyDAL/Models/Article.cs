namespace ModawantyDAL.Models
{
    public class Article
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string? AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public bool IsPublished { get; set; }
        public bool IsDeleted { get; set; }

        public string? FeaturedImageUrl { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int? ArticleViews { get; set; }

        public int? ReadTimeInMiniutes { get; set; }

        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

        // Navigation property for users who saved this article
        public ICollection<UserSavedArticle> SavedByUsers { get; set; } = new List<UserSavedArticle>();
    }
}
