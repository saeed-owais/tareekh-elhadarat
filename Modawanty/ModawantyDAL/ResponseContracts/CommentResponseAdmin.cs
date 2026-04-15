namespace ModawantyDAL.ResponseDto
{
    public class CommentResponseAdmin
    {
        public int? Id { get; set; }
        public string UserName { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ArticleTitle { get; set; }
        public int? ArticleId { get; set; }
        public bool? IsPublished { get; set; }
    }
}
