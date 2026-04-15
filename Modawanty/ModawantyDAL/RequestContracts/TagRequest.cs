using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.RequestDto
{
    public class TagRequest
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public bool IsAvailable { get; set; }
    }
}
