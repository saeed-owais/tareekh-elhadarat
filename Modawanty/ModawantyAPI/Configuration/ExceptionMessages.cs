namespace ModawantyAPI.Configuration
{
    /// <summary>
    /// Exception handling constants and configuration
    /// </summary>
    public static class ExceptionMessages
    {
        // Validation errors (400)
        public const string InvalidArgumentProvided = "Invalid argument provided";
        public const string InvalidJsonFormat = "Invalid JSON format in request body";
        public const string InvalidOperation = "Invalid operation";

        // Authentication errors (401)
        public const string UnauthorizedAccess = "Unauthorized access";
        public const string UserMustBeLoggedIn = "User must be logged in";

        // Permission errors (403)
        public const string ForbiddenAccess = "You do not have permission to perform this action";

        // Not found errors (404)
        public const string ResourceNotFound = "The requested resource was not found";

        // Timeout errors (408)
        public const string RequestTimeout = "Request timeout. The operation took too long to complete.";

        // Database errors (500)
        public const string DatabaseOperationFailed = "Database operation failed. Please try again.";
        public const string CannotPerformOperationDueToRelatedData = "Cannot perform this operation due to related data";
        public const string RecordAlreadyExists = "This record already exists";

        // Server errors (500)
        public const string UnexpectedError = "An unexpected error occurred. Please try again later.";
        public const string RequestCancelled = "Request was cancelled";
    }
}
