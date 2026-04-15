namespace ModawantyDAL.ResponseDto
{
    public class ArticleResponseUser
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string AuthorName { get; set; }

        public string Content { get; set; }

        public string? ImageUrl { get; set; }

        public string Category { get; set; }
        public int? ReadTimeInMiniutes { get; set; }
        public int? Views { get; set; }
        public DateTime? CreatedAt { get; set; }

        public List<string> Tags { get; set; }
        public List<CommentResponse>? Comments { get; set; }

    }
}
