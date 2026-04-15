namespace ModawantyDAL.RequestDto
{
    public class PaginationRequest
    {
        private int _pageNumber = 1;
        private int _pageSize = 10;

        /// <summary>
        /// Page number (1-based indexing). Default is 1.
        /// </summary>
        public int PageNumber
        {
            get => _pageNumber;
            set => _pageNumber = value < 1 ? 1 : value;
        }

        /// <summary>
        /// Number of items per page. Default is 10. Maximum is 100.
        /// </summary>
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value < 1 ? 10 : value > 100 ? 100 : value;
        }

        /// <summary>
        /// Gets the number of items to skip for the current page.
        /// </summary>
        public int Skip => (PageNumber - 1) * PageSize;
    }
}
