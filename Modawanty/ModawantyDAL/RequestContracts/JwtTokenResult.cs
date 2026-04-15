namespace ModawantyDAL.RequestDto
{
    public class JwtTokenResult
    {
        public string Token { get; set; }
        public DateTime ExpiryAt { get; set; }
    }
}
