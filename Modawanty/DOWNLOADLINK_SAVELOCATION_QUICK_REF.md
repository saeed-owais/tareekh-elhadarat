# Quick Reference: DownloadLink vs SaveLocation

## What's the difference?

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOK DATABASE RECORD                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Poster: "/books/poster_123.jpg"                               │
│  ┗━━ Local file path (wwwroot/books/)                         │
│  ┗━━ Used by: Frontend to display cover image                │
│                                                                 │
│  DownloadLink: "https://res.cloudinary.com/.../.../book.pdf"  │
│  ┗━━ Cloudinary public URL (HTTPS)                           │
│  ┗━━ Used by: Frontend to download PDF                       │
│  ┗━━ How to use: <a href={downloadLink}>Download</a>         │
│                                                                 │
│  SaveLocation: "modawanty/books/book_title_guid"              │
│  ┗━━ Cloudinary public ID (internal reference)               │
│  ┗━━ Used by: Backend to delete PDF from Cloudinary          │
│  ┗━━ How to use: DeletePdfAsync(saveLocation)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Comparison Table

| Feature | DownloadLink | SaveLocation |
|---------|-------------|-------------|
| **Value Type** | Full HTTPS URL | Public ID string |
| **Example** | `https://res.cloudinary.com/.../.../book.pdf` | `modawanty/books/title_guid` |
| **Visibility** | Send to frontend ✅ | Keep on backend ❌ |
| **Purpose** | Download the PDF | Delete the PDF |
| **Used In** | Client requests | DeleteBookAdmin method |
| **Storage** | Database DownloadLink field | Database SaveLocation field |

## Code Examples

### Frontend Usage (Getting DownloadLink)
```javascript
// Fetch book details
const book = await fetch('/api/books/123').then(r => r.json());

// Display download button
<a href={book.downloadLink} download="book.pdf">
  📥 Download PDF
</a>
```

### Backend Usage (Using SaveLocation)
```csharp
// Delete book and cleanup files
public async Task<Result<bool>> DeleteBookAdmin(int bookId, CancellationToken cancellationToken)
{
    var book = await _context.Books.FindAsync(bookId);
    
    // DELETE FROM CLOUDINARY using SaveLocation
    await _pdfUploadService.DeletePdfAsync(book.SaveLocation);
    
    // DELETE LOCAL IMAGE
    await _imageService.DeleteImageAsync(book.Poster);
    
    // SOFT DELETE from database
    book.IsDeleted = true;
    await _context.SaveChangesAsync();
    
    return Result<bool>.Success(200, true);
}
```

## Where They Come From (PdfUploadResult)

```csharp
// PdfUploadCloudinaryService.UploadPdfAsync() returns:
var pdfUploadResult = new PdfUploadResult
{
    // DownloadUrl comes from Cloudinary response
    DownloadUrl = uploadResult.SecureUrl.ToString(),  // "https://..."
    
    // PublicId is the ID we generated
    PublicId = publicId  // "modawanty/books/book_title_guid"
};

// BookService then stores both in database
var book = new Book
{
    DownloadLink = pdfUploadResult.DownloadUrl,   // Store URL for clients
    SaveLocation = pdfUploadResult.PublicId,       // Store ID for deletion
};
```

## Key Takeaway

```
DOWNLOAD = Public URL (share with clients)
SAVE/DELETE = Public ID (keep on server)
```

Both are needed to properly manage the PDF lifecycle!
