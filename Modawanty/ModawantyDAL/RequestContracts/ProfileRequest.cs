using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyDAL.RequestContracts
{
    public class ProfileRequest
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? AuthorName { get; set; }
        public IFormFile? ProfilePhoto { get; set; }
        public string? Bio { get; set; }

    }
}
