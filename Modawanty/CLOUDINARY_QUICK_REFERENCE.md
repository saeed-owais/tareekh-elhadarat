# Quick Reference: Cloudinary PDF Upload Service

## Summary
A production-ready service for uploading book PDFs to Cloudinary with a **15MB file size limit** and comprehensive validation.

## Key Features

| Feature | Details |
|---------|---------|
| **File Size Limit** | 15 MB |
| **File Types** | PDF only (MIME type validation) |
| **Storage** | Cloudinary (modawanty/books/ folder) |
| **URL Type** | Secure HTTPS |
| **Upload Type** | Stream-based (memory efficient) |
| **Logging** | Full audit trail |
| **Error Handling** | Cleanup on failure |

## Core Validations

### ✅ File Size Check
```
Maximum: 15 MB (15,728,640 bytes)
Returns 400 if exceeded
Error: "File size exceeds maximum allowed size of 15 MB. Current size: {actual size}"
```

### ✅ MIME Type Check
```
Allowed: application/pdf
Returns 400 if different
Error: "Invalid file type. Only PDF files are allowed. Received: {type}"
```

### ✅ Extension Check
```
Allowed: .pdf
Returns 400 if different
Error: "Invalid file extension. Only .pdf files are allowed. Received: {ext}"
```

## Implementation in BookService

```csharp
// Dependencies
private readonly IPdfUploadService _pdfUploadService;

// Usage
string bookUrl = await _pdfUploadService.UploadPdfAsync(
    bookRequest.Book,           // IFormFile
    bookRequest.Title,          // Optional filename
    cancellationToken           // Cancellation support
);

// Store in database
book.DownloadLink = bookUrl;
```

## Configuration (Already Done)

**appsettings.json:**
```json
"Cloudinary": {
  "CloudName": "dcpicoord",
  "ApiKey": "757469985263491",
  "ApiSecret": "MJWWmDtOuUWLrO5zbxZ-Nr8hAmw"
}
```

**Program.cs:**
```csharp
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("Cloudinary"));
    
builder.Services.AddScoped<IPdfUploadService, PdfUploadService>();
```

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `CloudinarySettings.cs` | Created | Configuration model |
| `IPdfUploadService.cs` | Created | Service interface |
| `PdfUploadService.cs` | Created | Implementation (15MB limit + validation) |
| `BookService.cs` | Updated | Integrated PDF upload with cleanup |
| `Program.cs` | Updated | Registered services |

## API Endpoint

```
POST /api/books/add-book-admin
Content-Type: multipart/form-data

Form Data:
- title: "Book Title"
- author: "Author Name"
- pageCount: 250
- releaseDate: "2025-01-15"
- about: "Description..."
- poster: [image file]
- book: [PDF file - max 15MB]

Response (201):
{
  "statusCode": 201,
  "isSuccess": true,
  "data": true
}

Response (400):
{
  "statusCode": 400,
  "isSuccess": false,
  "errors": ["File size exceeds maximum allowed size of 15 MB..."]
}
```

## Error Messages

| Scenario | Response | HTTP Code |
|----------|----------|-----------|
| PDF > 15 MB | "File size exceeds maximum allowed size of 15 MB. Current size: X.XX MB" | 400 |
| Not PDF | "Invalid file type. Only PDF files are allowed. Received: {type}" | 400 |
| Wrong extension | "Invalid file extension. Only .pdf files are allowed. Received: {ext}" | 400 |
| No PDF provided | "Book PDF file is required" | 400 |
| Cloudinary error | "Failed to upload PDF to cloud storage: {error}" | 400 |

## Cleanup Behavior

```
If Poster Upload Fails:
  → Return error immediately
  → No PDF upload attempted
  → No cleanup needed

If PDF Upload Fails:
  → Automatically delete uploaded poster
  → Return error to client
  → Both operations logged
```

## Logging Levels

```
✓ INFO: PDF upload started/completed
✓ WARNING: File too large, invalid format
✗ ERROR: Cloudinary API failures, unexpected errors
```

## Build Status
✅ **Build successful** - Ready for deployment

## Next Steps

1. **Test uploads** with various file sizes
2. **Monitor Cloudinary** storage usage
3. **Configure production** Cloudinary account if different
4. **Add rate limiting** if needed (future enhancement)
5. **Implement virus scanning** (optional, future)

## Support

All validations happen **before** upload to Cloudinary:
- File size checked first (fastest fail)
- MIME type checked next
- Extension checked last
- Only valid files sent to Cloudinary (cost optimization)

**Memory efficient:**
- PDFs streamed directly to Cloudinary
- Not cached locally
- ~15 MB peak per concurrent upload
