namespace ModawantyDAL.RequestDto
{
    public class AuthResult
    {
        public string JwtToken { get; set; }
        public DateTime ExpiryAt { get; set; }

    }
}
