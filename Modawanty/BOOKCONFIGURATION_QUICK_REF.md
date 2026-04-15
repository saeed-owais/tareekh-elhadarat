# BookConfiguration Quick Reference

## What It Does
The `BookConfiguration` class configures the `Book` entity for Entity Framework Core. It defines:
- Property constraints (required, max length, defaults)
- Database indexes for query performance
- Table schema and naming
- Soft delete support

## Auto-Discovery
The DbContext automatically discovers and applies this configuration:
```csharp
// In ApplicationDbContext
protected override void OnModelCreating(ModelBuilder builder)
{
    builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    // ↑ This finds BookConfiguration.cs automatically
}
```

## Indexes Created

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `IX_Books_Title_IsDeleted` | (Title, IsDeleted) | Title searches + soft delete support |
| `IX_Books_IsDeleted` | (IsDeleted) | Filter active books (IsDeleted = false) |
| `IX_Books_CreatedAt` | (CreatedAt DESC) | Sort by newest first |
| `IX_Books_Author` | (Author) | Author-based searches |

## Property Constraints

```csharp
Title          : Required, Max 500 chars
Author         : Required, Max 200 chars
PageCount      : Required
ReleaseDate    : Required
About          : Required, Max 2000 chars
Poster         : Required, Max 500 chars (local file path)
DownloadLink   : Required, Max 1000 chars (Cloudinary URL)
SaveLocation   : Required, Max 300 chars (Cloudinary public ID)
CreatedAt      : Required, Default = GETUTCDATE()
IsDeleted      : Required, Default = false
```

## Common Query Patterns

### Always Filter Soft-Deleted Books
```csharp
// ❌ DON'T - Gets deleted books too
var books = await _context.Books.ToListAsync();

// ✅ DO - Only active books
var books = await _context.Books
    .Where(b => !b.IsDeleted)
    .ToListAsync();
```

### Leverage Indexes
```csharp
// Uses IX_Books_Title_IsDeleted
var exists = await _context.Books
    .AnyAsync(b => b.Title == "Title" && !b.IsDeleted);

// Uses IX_Books_IsDeleted + IX_Books_CreatedAt
var recent = await _context.Books
    .Where(b => !b.IsDeleted)
    .OrderByDescending(b => b.CreatedAt)
    .Take(10)
    .ToListAsync();

// Uses IX_Books_Author
var authorBooks = await _context.Books
    .Where(b => b.Author == "Author Name" && !b.IsDeleted)
    .ToListAsync();
```

## File Location
```
ModawantyDAL/Data/Configurations/BookConfiguration.cs
```

## Dependencies
- Microsoft.EntityFrameworkCore
- ModawantyDAL.Models.Book

## Key Points

1. **Soft Delete**: Always use `IsDeleted = true` instead of deleting records
2. **Unique Titles**: Only unique among non-deleted books (allows reusing deleted titles)
3. **UTC Timestamps**: CreatedAt is set by database in UTC
4. **All Properties Required**: No nullable fields - validation handled at model level
5. **Indexes Optimized**: Composite and individual indexes for common queries

## Related Files
- `ModawantyBLL/Service/BookService.cs` - Uses this configuration implicitly
- `ModawantyDAL/Models/Book.cs` - The entity being configured
- `ModawantyDAL/Data/ApplicationDbContext.cs` - Applies this configuration

## Version Information
- C# Version: 14.0
- .NET Target: .NET 10
- Entity Framework Core: Latest (via NuGet)

