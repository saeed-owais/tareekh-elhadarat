namespace ModawantyBLL.Exceptions
{
    /// <summary>
    /// Base custom exception for Modawanty application
    /// </summary>
    public class ModawantyException : Exception
    {
        public int StatusCode { get; set; }

        public ModawantyException(string message, int statusCode = 500) : base(message)
        {
            StatusCode = statusCode;
        }

        public ModawantyException(string message, Exception innerException, int statusCode = 500)
            : base(message, innerException)
        {
            StatusCode = statusCode;
        }
    }

    /// <summary>
    /// Exception thrown when a resource is not found
    /// </summary>
    public class ResourceNotFoundException : ModawantyException
    {
        public ResourceNotFoundException(string resourceName, int id)
            : base($"{resourceName} with ID {id} not found", 404)
        {
        }

        public ResourceNotFoundException(string message)
            : base(message, 404)
        {
        }
    }

    /// <summary>
    /// Exception thrown when validation fails
    /// </summary>
    public class ValidationException : ModawantyException
    {
        public Dictionary<string, string[]> Errors { get; set; }

        public ValidationException(string message, Dictionary<string, string[]> errors)
            : base(message, 400)
        {
            Errors = errors;
        }

        public ValidationException(string message)
            : base(message, 400)
        {
            Errors = new Dictionary<string, string[]>();
        }
    }

    /// <summary>
    /// Exception thrown when user is not authorized
    /// </summary>
    public class UnauthorizedException : ModawantyException
    {
        public UnauthorizedException(string message = "Unauthorized")
            : base(message, 401)
        {
        }
    }

    /// <summary>
    /// Exception thrown when user doesn't have permission
    /// </summary>
    public class ForbiddenException : ModawantyException
    {
        public ForbiddenException(string message = "Forbidden")
            : base(message, 403)
        {
        }
    }

    /// <summary>
    /// Exception thrown when operation fails due to business logic
    /// </summary>
    public class BusinessLogicException : ModawantyException
    {
        public BusinessLogicException(string message)
            : base(message, 400)
        {
        }
    }
}
