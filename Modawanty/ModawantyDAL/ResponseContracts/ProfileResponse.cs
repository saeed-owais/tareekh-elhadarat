using System;
using System.Collections.Generic;
using System.Text;

namespace ModawantyDAL.ResponseContracts
{
    public class ProfileResponse
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string? AuthorName { get; set; }
        public string? ProfilePhoto { get; set; }
        public string? Bio { get; set; }


    }
}
