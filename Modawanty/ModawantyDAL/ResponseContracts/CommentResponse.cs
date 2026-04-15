namespace ModawantyDAL.ResponseDto
{
    public class CommentResponse
    {
        public int? Id { get; set; }
        public string UserName { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
