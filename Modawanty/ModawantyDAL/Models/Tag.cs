namespace ModawantyDAL.Models
{
    public class Tag
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public bool IsAvailable { get; set; }

        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }
}
