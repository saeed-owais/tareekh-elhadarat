# Global Exception Handling Implementation

## Overview
This document describes the global exception handling system implemented in the Modawanty API.

## Architecture

### Components

#### 1. **Custom Exception Classes** (`ModawantyBLL/Exceptions/ModawantyException.cs`)
- `ModawantyException`: Base exception with HTTP status code
- `ResourceNotFoundException`: For 404 errors
- `ValidationException`: For 400 validation errors with detailed field errors
- `UnauthorizedException`: For 401 auth errors
- `ForbiddenException`: For 403 permission errors
- `BusinessLogicException`: For business rule violations

#### 2. **Error Response Model** (`ModawantyAPI/Models/ErrorResponse.cs`)
```csharp
{
    "statusCode": 400,
    "message": "Validation failed",
    "details": null,
    "traceId": "0HN3RRUVS6TDN:00000001",
    "errors": {
        "Title": ["Title is required", "Title must be less than 250 characters"],
        "CategoryId": ["Invalid category"]
    },
    "timestamp": "2026-01-15T10:30:45.123Z"
}
```

#### 3. **Global Exception Middleware** (`ModawantyAPI/Middleware/GlobalExceptionHandlingMiddleware.cs`)
- Implements `IExceptionHandler` interface
- Catches all unhandled exceptions
- Maps exceptions to appropriate HTTP status codes
- Logs errors appropriately
- Returns consistent JSON error responses

## Usage Examples

### 1. Throwing Resource Not Found Exception
```csharp
var article = await _context.Articles.FindAsync(id);
if (article == null)
    throw new ResourceNotFoundException("Article", id);
    // Returns: 404 {"message": "Article with ID 5 not found"}
```

### 2. Throwing Validation Exception
```csharp
var errors = new Dictionary<string, string[]>
{
    { "Email", new[] { "Invalid email format" } },
    { "Password", new[] { "Password must be at least 8 characters" } }
};
throw new ValidationException("Validation failed", errors);
```

### 3. Throwing Unauthorized Exception
```csharp
if (!isAuthenticated)
    throw new UnauthorizedException("User must be logged in");
    // Returns: 401 {"message": "User must be logged in"}
```

### 4. Throwing Business Logic Exception
```csharp
if (article.IsDeleted)
    throw new BusinessLogicException("Cannot publish a deleted article");
    // Returns: 400 {"message": "Cannot publish a deleted article"}
```

### 5. Throwing Forbidden Exception
```csharp
if (article.AuthorId != currentUserId && !isAdmin)
    throw new ForbiddenException("You do not have permission to edit this article");
    // Returns: 403 {"message": "You do not have permission to edit this article"}
```

## Exception Handling Flow

```
Request
   ↓
Controller/Service
   ↓
Exception Thrown
   ↓
GlobalExceptionHandlingMiddleware
   ↓
Categorize Exception Type
   ↓
Log (Info/Warning/Error)
   ↓
Create ErrorResponse
   ↓
Return JSON Response + HTTP Status Code
```

## Logging Levels

| Exception Type | Log Level | Example |
|---|---|---|
| ResourceNotFoundException | Info | "Resource not found: Article with ID 5 not found" |
| ValidationException | Warning | "Validation error: Email format is invalid" |
| UnauthorizedException | Warning | "Unauthorized access attempt: Invalid token" |
| ForbiddenException | Warning | "Forbidden access attempt: User lacks permissions" |
| TimeoutException | Error | "Timeout exception: Database query timeout" |
| DbUpdateException | Error | "Database update exception occurred" |
| Other Exceptions | Error | "Unhandled exception occurred" |

## HTTP Status Codes

| Status Code | Exception | Use Case |
|---|---|---|
| 400 | ValidationException, BusinessLogicException | Bad request, validation failed |
| 401 | UnauthorizedException | Authentication required |
| 403 | ForbiddenException | Insufficient permissions |
| 404 | ResourceNotFoundException | Resource not found |
| 408 | TimeoutException | Request timeout |
| 500 | All other exceptions | Internal server error |

## Configuration in Program.cs

```csharp
// Register exception handling middleware
builder.Services.AddExceptionHandler<GlobalExceptionHandlingMiddleware>();
builder.Services.AddProblemDetails();

// Use exception handling in middleware pipeline
app.UseExceptionHandler();
```

## Best Practices

### 1. **Throw Specific Exceptions**
✅ DO:
```csharp
throw new ResourceNotFoundException("Article", id);
```
❌ DON'T:
```csharp
throw new Exception("Article not found");
```

### 2. **Include Context in Messages**
✅ DO:
```csharp
throw new ValidationException(
    $"User email '{email}' already exists in the system",
    errors
);
```

### 3. **Let Middleware Handle All Exceptions**
✅ DO:
```csharp
// Let middleware catch and handle
try { /* code */ } 
catch (Exception ex) { throw; }
```
❌ DON'T:
```csharp
try { /* code */ } 
catch (Exception ex) { return BadRequest(ex.Message); }
```

### 4. **Validate Before Processing**
```csharp
public async Task<Result<bool>> CreateArticle(ArticleRequest request)
{
    var errors = new Dictionary<string, string[]>();
    
    if (string.IsNullOrWhiteSpace(request.Title))
        errors["Title"] = new[] { "Title is required" };
    
    if (request.Title?.Length > 250)
        errors["Title"] = new[] { "Title must not exceed 250 characters" };
    
    if (errors.Any())
        throw new ValidationException("Article validation failed", errors);
    
    // ... proceed with creation
}
```

## Error Response Examples

### Validation Error
```json
{
    "statusCode": 400,
    "message": "Article validation failed",
    "details": null,
    "errors": {
        "Title": ["Title is required"],
        "CategoryId": ["Invalid category ID"]
    },
    "traceId": "0HN3RRUVS6TDN:00000001",
    "timestamp": "2026-01-15T10:30:45.123Z"
}
```

### Not Found Error
```json
{
    "statusCode": 404,
    "message": "Article with ID 999 not found",
    "details": null,
    "traceId": "0HN3RRUVS6TDN:00000002",
    "timestamp": "2026-01-15T10:30:45.123Z"
}
```

### Unauthorized Error
```json
{
    "statusCode": 401,
    "message": "User must be logged in",
    "details": null,
    "traceId": "0HN3RRUVS6TDN:00000003",
    "timestamp": "2026-01-15T10:30:45.123Z"
}
```

### Internal Server Error
```json
{
    "statusCode": 500,
    "message": "An unexpected error occurred",
    "details": "Timeout expired. The timeout period elapsed...",
    "traceId": "0HN3RRUVS6TDN:00000004",
    "timestamp": "2026-01-15T10:30:45.123Z"
}
```

## Future Enhancements

1. **Exception Notification**: Send critical errors to monitoring service (e.g., Sentry)
2. **Custom Exception Handlers**: Add specialized handlers for specific exception types
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Request Logging**: Log full request/response details for debugging
5. **Custom Error Pages**: Create custom error pages for different error types

## Testing

### Unit Test Example
```csharp
[Fact]
public async Task CreateArticle_WithValidData_ThrowsNoException()
{
    // Arrange
    var request = new ArticleRequest { Title = "Valid Title" };
    
    // Act & Assert
    await _service.CreateArticle(request);
}

[Fact]
public async Task CreateArticle_WithEmptyTitle_ThrowsValidationException()
{
    // Arrange
    var request = new ArticleRequest { Title = "" };
    
    // Act & Assert
    await Assert.ThrowsAsync<ValidationException>(
        () => _service.CreateArticle(request)
    );
}
```

## Related Files
- `ModawantyAPI/Program.cs` - Middleware configuration
- `ModawantyAPI/Middleware/GlobalExceptionHandlingMiddleware.cs` - Exception handler implementation
- `ModawantyBLL/Exceptions/ModawantyException.cs` - Exception classes
- `ModawantyAPI/Models/ErrorResponse.cs` - Error response model
