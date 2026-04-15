using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using ModawantyAPI.Configuration;
using ModawantyAPI.Models;
using ModawantyBLL.Exceptions;
using System.Net;
using System.Text.Json;

namespace ModawantyAPI.Middleware
{
    /// <summary>
    /// Global exception handling middleware for the application
    /// Handles all unhandled exceptions and returns consistent JSON error responses
    /// </summary>
    public class GlobalExceptionHandlingMiddleware : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _environment;
        private readonly ExceptionMessageLocalizer _localizer;

        public GlobalExceptionHandlingMiddleware(
            ILogger<GlobalExceptionHandlingMiddleware> logger,
            IHostEnvironment environment,
            ExceptionMessageLocalizer localizer)
        {
            _logger = logger;
            _environment = environment;
            _localizer = localizer;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var response = httpContext.Response;
            response.ContentType = "application/json";

            var errorResponse = new ErrorResponse(
                (int)HttpStatusCode.InternalServerError,
                _localizer.Get(nameof(ExceptionMessages.UnexpectedError)),
                _environment.IsDevelopment() ? exception.Message : null
            )
            {
                TraceId = httpContext.TraceIdentifier
            };

            try
            {
                switch (exception)
                {
                    case ModawantyException modawantyEx:
                        HandleModawantyException(response, errorResponse, modawantyEx);
                        break;

                    case DbUpdateException dbEx:
                        HandleDbUpdateException(response, errorResponse, dbEx);
                        break;

                    case ArgumentNullException argNullEx:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.InvalidArgumentProvided));
                        errorResponse.Details = _environment.IsDevelopment() ? argNullEx.ParamName : null;
                        _logger.LogWarning($"Argument null exception: {argNullEx.ParamName}");
                        break;

                    case ArgumentException argEx:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.InvalidArgumentProvided));
                        errorResponse.Details = _environment.IsDevelopment() ? argEx.Message : null;
                        _logger.LogWarning($"Argument exception: {argEx.Message}");
                        break;

                    case InvalidOperationException invalidOpEx:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.InvalidOperation));
                        errorResponse.Details = _environment.IsDevelopment() ? invalidOpEx.Message : null;
                        _logger.LogWarning($"Invalid operation: {invalidOpEx.Message}");
                        break;

                    case UnauthorizedAccessException unauthorizedEx:
                        response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.UnauthorizedAccess));
                        errorResponse.Details = _environment.IsDevelopment() ? unauthorizedEx.Message : null;
                        _logger.LogWarning($"Unauthorized access: {unauthorizedEx.Message}");
                        break;

                    case TimeoutException timeoutEx:
                        response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                        errorResponse.StatusCode = (int)HttpStatusCode.RequestTimeout;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.RequestTimeout));
                        errorResponse.Details = null;
                        _logger.LogError($"Request timeout: {timeoutEx.Message}");
                        break;

                    case JsonException jsonEx:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.InvalidJsonFormat));
                        errorResponse.Details = _environment.IsDevelopment() ? jsonEx.Message : null;
                        _logger.LogWarning($"JSON parsing error: {jsonEx.Message}");
                        break;

                    case OperationCanceledException cancelEx:
                        response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                        errorResponse.StatusCode = (int)HttpStatusCode.RequestTimeout;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.RequestCancelled));
                        errorResponse.Details = null;
                        _logger.LogWarning($"Operation cancelled: {cancelEx.Message}");
                        break;

                    case Exception ex:
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                        errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.UnexpectedError));
                        errorResponse.Details = _environment.IsDevelopment() ? ex.Message : null;
                        _logger.LogError(ex, "Unhandled exception occurred");
                        break;
                }
            }
            catch (Exception handlerException)
            {
                // Prevent exception handler from throwing
                _logger.LogError(handlerException, "Exception occurred while handling an exception");
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.UnexpectedError));
            }

            var result = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = _environment.IsDevelopment()
            });

            await response.WriteAsync(result, cancellationToken);
            return true;
        }

        private void HandleModawantyException(
            HttpResponse response,
            ErrorResponse errorResponse,
            ModawantyException modawantyEx)
        {
            response.StatusCode = modawantyEx.StatusCode;
            errorResponse.StatusCode = modawantyEx.StatusCode;
            errorResponse.Message = modawantyEx.Message;
            errorResponse.Details = null;

            switch (modawantyEx)
            {
                case ValidationException validationEx:
                    errorResponse.Errors = validationEx.Errors;
                    _logger.LogWarning($"Validation error: {modawantyEx.Message}");
                    break;

                case ResourceNotFoundException:
                    _logger.LogInformation($"Resource not found: {modawantyEx.Message}");
                    break;

                case UnauthorizedException:
                    _logger.LogWarning($"Unauthorized access attempt: {modawantyEx.Message}");
                    break;

                case ForbiddenException:
                    _logger.LogWarning($"Forbidden access attempt: {modawantyEx.Message}");
                    break;

                default:
                    _logger.LogError($"Business logic exception: {modawantyEx.Message}");
                    break;
            }
        }

        private void HandleDbUpdateException(
            HttpResponse response,
            ErrorResponse errorResponse,
            DbUpdateException dbEx)
        {
            response.StatusCode = (int)HttpStatusCode.InternalServerError;
            errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Check for specific database errors
            if (dbEx.InnerException?.Message.Contains("FOREIGN KEY constraint failed") == true)
            {
                errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.CannotPerformOperationDueToRelatedData));
                _logger.LogWarning($"Foreign key constraint violation: {dbEx.Message}");
            }
            else if (dbEx.InnerException?.Message.Contains("UNIQUE constraint failed") == true)
            {
                errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.RecordAlreadyExists));
                _logger.LogWarning($"Unique constraint violation: {dbEx.Message}");
            }
            else
            {
                errorResponse.Message = _localizer.Get(nameof(ExceptionMessages.DatabaseOperationFailed));
                _logger.LogError(dbEx, "Database update exception occurred");
            }

            errorResponse.Details = _environment.IsDevelopment() ? dbEx.InnerException?.Message : null;
        }
    }
}

