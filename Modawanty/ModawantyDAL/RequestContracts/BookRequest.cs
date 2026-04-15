using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.RequestContracts
{
    public class BookRequest
    {
        public int Id { get; set; }

        [MaxLength(250)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string Author { get; set; }
        public int PageCount { get; set; }
        public DateOnly ReleaseDate { get; set; }

        [MaxLength(5000)]
        public string About { get; set; }

        public IFormFile? Poster { get; set; }
        public IFormFile Book { get; set; }
    }
}
