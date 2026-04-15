namespace ModawantyDAL.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int PageCount { get; set; }
        public DateOnly ReleaseDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public string About { get; set; }
        public string Poster { get; set; }
        public string SaveLocation { get; set; }
        public string DownloadLink { get; set; }
    }
}
