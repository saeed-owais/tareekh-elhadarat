namespace ModawantyDAL.ResponseDto
{
    public class ArticleResponseAdmin
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string AuthorName { get; set; }
        public string Content { get; set; }
        public int? CategoryId { get; set; }
        public string? Category { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public string? ImageUrl { get; set; }
        public int? Views { get; set; }

        public bool? IsPublished { get; set; }
        public bool? IsDeleted { get; set; }

    }
}
