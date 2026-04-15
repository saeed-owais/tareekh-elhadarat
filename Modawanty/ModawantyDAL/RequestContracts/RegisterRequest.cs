using DataAccessLayer.Errors;
using DataAccessLayer.Patterns;
using System.ComponentModel.DataAnnotations;

namespace ModawantyDAL.RequestDto
{
    public class RegisterRequest
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; }

        [Required]
        [MaxLength(250)]
        [RegularExpression(RegexPatterns.PasswordPattern, ErrorMessage = RegexErrors.PasswordPattern)]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = RegexErrors.PasswordMisMatch)]
        public string ConfirmPassword { get; set; }
    }
}
