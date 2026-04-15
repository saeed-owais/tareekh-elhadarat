namespace ModawantyDAL.ResponseDto
{
    /// <summary>
    /// Contains the result of a PDF upload to Cloudinary
    /// Used to store both the download URL and the public ID for later deletion
    /// </summary>
    public class PdfUploadResult
    {

        public string DownloadUrl { get; set; } = string.Empty;

        public string PublicId { get; set; } = string.Empty;
    }
}
