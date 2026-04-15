# Understanding DownloadLink and SaveLocation Properties

## Overview

When a book is uploaded via `AddBookAdmin`, two properties are stored in the database that serve different purposes:

## Property Descriptions

### 1. **DownloadLink** - The URL for downloading the PDF
- **What it is**: The Cloudinary HTTPS URL where the PDF file is stored
- **Format**: `https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/modawanty/books/book_title_guid.pdf`
- **Purpose**: Used by clients/frontend to download the PDF
- **Usage in Frontend**:
  ```javascript
  // Get book data from API
  const book = await fetch('/api/books/{bookId}').then(r => r.json());
  
  // Use DownloadLink to create download button
  <a href={book.downloadLink} download="BookTitle.pdf">
    Download PDF
  </a>
  ```

### 2. **SaveLocation** - The Cloudinary public ID for deletion
- **What it is**: The Cloudinary public ID (internal identifier) for the PDF
- **Format**: `modawanty/books/book_title_guid`
- **Purpose**: Used internally to delete the PDF when the book is deleted
- **Usage in Backend**:
  ```csharp
  // When deleting a book
  public async Task<Result<bool>> DeleteBookAdmin(int bookId, CancellationToken cancellationToken)
  {
      var book = await _context.Books.FindAsync(new object[] { bookId }, cancellationToken: cancellationToken);
      
      if (book == null)
          return Result<bool>.Fail(404, new[] { "Book not found" });
      
      try
      {
          // Use SaveLocation (public ID) to delete PDF from Cloudinary
          await _pdfUploadService.DeletePdfAsync(book.SaveLocation, cancellationToken);
          
          // Delete poster from local storage
          await _imageService.DeleteImageAsync(book.Poster);
          
          // Soft delete the book
          book.IsDeleted = true;
          _context.Books.Update(book);
          await _context.SaveChangesAsync(cancellationToken);
          
          return Result<bool>.Success(200, true);
      }
      catch (Exception ex)
      {
          return Result<bool>.Fail(400, new[] { ex.Message });
      }
  }
  ```

## Data Flow Diagram

```
User uploads book via AddBookAdmin
          ↓
    [Frontend sends multipart/form-data with poster image + PDF]
          ↓
PdfUploadService.UploadPdfAsync()
          ├─ Validates file (size, type, extension)
          ├─ Uploads to Cloudinary → generates public ID
          └─ Returns PdfUploadResult:
             {
                 DownloadUrl: "https://res.cloudinary.com/.../modawanty/books/..." (URL for clients)
                 PublicId: "modawanty/books/book_title_guid" (ID for server)
             }
          ↓
ImageService.UploadImageAsync()
          └─ Returns posterUrl (local wwwroot URL)
          ↓
BookService.AddBookAdmin() creates Book entity:
{
    Title: "The Great Gatsby",
    Author: "F. Scott Fitzgerald",
    Poster: "/books/poster_123.jpg",        ← Local image URL
    DownloadLink: "https://...",             ← Cloudinary PDF URL (for clients)
    SaveLocation: "modawanty/books/...",    ← Cloudinary public ID (for server)
    CreatedAt: DateTime.Now,
    IsDeleted: false
}
          ↓
Book saved to database
```

## Usage Examples

### Getting a Book (for Frontend)
```csharp
[HttpGet("{bookId}")]
public async Task<IActionResult> GetBook(int bookId)
{
    var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == bookId && !b.IsDeleted);
    
    if (book == null)
        return NotFound();
    
    // Frontend uses DownloadLink to download PDF
    return Ok(new BookResponse
    {
        Id = book.Id,
        Title = book.Title,
        Author = book.Author,
        PosterUrl = book.Poster,
        DownloadUrl = book.DownloadLink,  // ← Used by frontend
        // SaveLocation is NOT sent to frontend (it's internal)
    });
}
```

### Deleting a Book (for Backend)
```csharp
[HttpDelete("{bookId}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> DeleteBook(int bookId)
{
    var book = await _context.Books.FindAsync(bookId);
    
    if (book == null)
        return NotFound();
    
    try
    {
        // Use SaveLocation (public ID) to delete from Cloudinary
        await _pdfUploadService.DeletePdfAsync(book.SaveLocation);
        
        // Delete local poster
        await _imageService.DeleteImageAsync(book.Poster);
        
        // Soft delete from database
        book.IsDeleted = true;
        await _context.SaveChangesAsync();
        
        return Ok("Book deleted successfully");
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
```

## PdfUploadResult Structure

The `PdfUploadResult` class is returned by `IPdfUploadService.UploadPdfAsync()`:

```csharp
public class PdfUploadResult
{
    /// <summary>
    /// The secure HTTPS URL to download the PDF from Cloudinary
    /// Used by clients/frontend to fetch the PDF file
    /// Example: https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/modawanty/books/book_title.pdf
    /// </summary>
    public string DownloadUrl { get; set; }

    /// <summary>
    /// The Cloudinary public ID for the uploaded file
    /// Used internally to delete the PDF when the book is deleted
    /// Example: modawanty/books/book_title_guid
    /// </summary>
    public string PublicId { get; set; }
}
```

## Storage Architecture

```
Local Storage (wwwroot/)
├── /books/
│   ├── poster_1.jpg
│   ├── poster_2.jpg
│   └── ...

Cloudinary Cloud Storage
├── modawanty/
│   └── books/
│       ├── The_Great_Gatsby_uuid1.pdf
│       ├── 1984_uuid2.pdf
│       └── ...
```

## Summary

| Property | Storage | Purpose | Used By | Example |
|----------|---------|---------|---------|---------|
| **DownloadLink** | Database | Frontend downloads PDF | Clients/Frontend | `<a href={book.downloadLink}>Download</a>` |
| **SaveLocation** | Database | Backend deletes PDF | Backend Service | `DeletePdfAsync(book.saveLocation)` |
| **Poster** | Database | Frontend displays cover | Clients/Frontend | `<img src={book.poster} />` |
| **Poster File** | `/wwwroot/books/` | Local storage | Server | Direct file access |
| **PDF File** | Cloudinary | Cloud storage | Cloudinary API | Upload/Download/Delete operations |

