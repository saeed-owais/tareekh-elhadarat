# BookConfiguration - Entity Framework Core Setup

## Overview

The `BookConfiguration` class defines all database constraints, validation rules, and indexes for the `Book` entity using EF Core's FluentAPI. This configuration is automatically discovered and applied by the `ApplicationDbContext` through the `ApplyConfigurationsFromAssembly()` method.

## File Location
```
ModawantyDAL\Data\Configurations\BookConfiguration.cs
```

## Configuration Details

### 1. Primary Key
```csharp
builder.HasKey(b => b.Id);
```
- Simple integer primary key
- Auto-incremented by SQL Server

### 2. Property Constraints

#### Title
```csharp
builder.Property(b => b.Title)
    .IsRequired()
    .HasMaxLength(500)
    .HasComment("Book title - must be unique");
```
- **Required**: Cannot be null
- **Max Length**: 500 characters
- **Purpose**: Unique book identifier for users
- **Validation**: Checked in `AddBookAdmin()` to prevent duplicates

#### Author
```csharp
builder.Property(b => b.Author)
    .IsRequired()
    .HasMaxLength(200);
```
- **Required**: Cannot be null
- **Max Length**: 200 characters
- **Purpose**: Book author name for display and search

#### PageCount
```csharp
builder.Property(b => b.PageCount)
    .IsRequired();
```
- **Required**: Must have a value
- **Type**: Integer
- **Purpose**: Total number of pages (for reader information)

#### ReleaseDate
```csharp
builder.Property(b => b.ReleaseDate)
    .IsRequired();
```
- **Required**: Cannot be null
- **Type**: DateOnly (date without time)
- **Purpose**: Original publication date of the book

#### About
```csharp
builder.Property(b => b.About)
    .IsRequired()
    .HasMaxLength(2000);
```
- **Required**: Cannot be null
- **Max Length**: 2000 characters
- **Purpose**: Book description/synopsis (supports long text)

#### Poster
```csharp
builder.Property(b => b.Poster)
    .IsRequired()
    .HasMaxLength(500);
```
- **Required**: Cannot be null
- **Max Length**: 500 characters
- **Purpose**: Local file path to book poster (e.g., `/books/poster_123.jpg`)
- **Storage**: wwwroot/books/

#### DownloadLink
```csharp
builder.Property(b => b.DownloadLink)
    .IsRequired()
    .HasMaxLength(1000);
```
- **Required**: Cannot be null
- **Max Length**: 1000 characters
- **Purpose**: Cloudinary HTTPS URL for downloading PDF
- **Example**: `https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/modawanty/books/book_title.pdf`

#### SaveLocation
```csharp
builder.Property(b => b.SaveLocation)
    .IsRequired()
    .HasMaxLength(300);
```
- **Required**: Cannot be null
- **Max Length**: 300 characters
- **Purpose**: Cloudinary public ID for PDF deletion
- **Example**: `modawanty/books/book_title_guid`

#### CreatedAt
```csharp
builder.Property(b => b.CreatedAt)
    .IsRequired()
    .HasDefaultValueSql("GETUTCDATE()");
```
- **Required**: Cannot be null
- **Default**: Current UTC timestamp (set by SQL Server)
- **Purpose**: Track when book was added to database
- **Note**: `GETUTCDATE()` ensures consistent UTC time regardless of server timezone

#### IsDeleted
```csharp
builder.Property(b => b.IsDeleted)
    .IsRequired()
    .HasDefaultValue(false);
```
- **Required**: Cannot be null
- **Default Value**: `false`
- **Purpose**: Soft delete flag (data preserved, just marked as deleted)
- **Queries**: All list queries should filter `IsDeleted = false`

### 3. Database Indexes

#### Composite Index: Title + IsDeleted
```csharp
builder.HasIndex(b => new { b.Title, b.IsDeleted })
    .HasName("IX_Books_Title_IsDeleted")
    .IsUnique(false);
```
- **Purpose**: Speed up title searches and uniqueness checks for active books
- **Benefits**: 
  - Allows same title if previous is deleted (soft delete friendly)
  - Fast duplicate title detection in `AddBookAdmin()`
  - Efficient filtering when listing books
- **Query**: `WHERE Title = 'The Great Gatsby' AND IsDeleted = false`

#### Index: IsDeleted
```csharp
builder.HasIndex(b => b.IsDeleted)
    .HasName("IX_Books_IsDeleted");
```
- **Purpose**: Optimize queries filtering for active books
- **Benefits**: All list endpoints do `WHERE IsDeleted = false` - this index speeds them up
- **Used By**: `GetAllBooksAdmin()`, `GetAllBooksUser()`, `SearchByTitle()`

#### Index: CreatedAt (Descending)
```csharp
builder.HasIndex(b => b.CreatedAt)
    .HasName("IX_Books_CreatedAt")
    .IsDescending();
```
- **Purpose**: Speed up chronological sorting (newest books first)
- **Benefits**: 
  - Descending order matches typical "newest first" user preference
  - Avoids separate sorting in application layer
- **Query**: `ORDER BY CreatedAt DESC`

#### Index: Author
```csharp
builder.HasIndex(b => b.Author)
    .HasName("IX_Books_Author");
```
- **Purpose**: Enable author-based searches
- **Benefits**: Fast lookups when filtering by author
- **Used By**: Potential "books by author" endpoint

### 4. Table Configuration
```csharp
builder.ToTable("Books", schema: "dbo")
    .HasComment("Books library containing Arabic cultural content...");
```
- **Table Name**: `Books`
- **Schema**: `dbo` (default database owner schema)
- **Database**: SQL Server

## Entity Relationships

Currently, the `Book` entity has **no foreign key relationships**. If future requirements need:
- **Categories**: Add `CategoryId` and configure relationship
- **Author Users**: Add `AuthorId` linking to `ApplicationUser`
- **Reviews/Ratings**: Configure one-to-many relationship

## Usage in Queries

### Get All Active Books (Paginated)
```csharp
var books = await _context.Books
    .Where(b => !b.IsDeleted)          // Uses IX_Books_IsDeleted
    .OrderByDescending(b => b.CreatedAt) // Uses IX_Books_CreatedAt
    .Skip(pageNumber * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

### Search by Title
```csharp
var results = await _context.Books
    .Where(b => b.Title.Contains(searchTerm) && !b.IsDeleted) // Uses IX_Books_Title_IsDeleted
    .ToListAsync();
```

### Check for Duplicate Title
```csharp
var exists = await _context.Books
    .AnyAsync(b => b.Title == title && !b.IsDeleted); // Uses IX_Books_Title_IsDeleted
```

### Get Books by Author
```csharp
var authorBooks = await _context.Books
    .Where(b => b.Author == authorName && !b.IsDeleted) // Uses IX_Books_Author
    .OrderByDescending(b => b.CreatedAt)
    .ToListAsync();
```

## Soft Delete Pattern

The configuration supports soft deletes:
- Instead of physically deleting records, set `IsDeleted = true`
- All queries must filter `IsDeleted = false` to get active books
- Historical data is preserved for auditing
- Recoverable - data not lost, just hidden

**Important**: Remember to add `.Where(b => !b.IsDeleted)` to every query!

## Migration

This configuration will be applied when you run:
```bash
dotnet ef migrations add UpdateBookConfiguration
dotnet ef database update
```

Or add to an existing migration:
```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AlterTable("Books")
        .Annotation("SqlServer:IsClustered", false);
    
    // Indexes will be created automatically by EF Core
}
```

## Best Practices Implemented

✅ **Proper Constraints**: All properties have appropriate length limits and null checks  
✅ **Strategic Indexes**: Indexes on frequently queried columns (IsDeleted, Title, CreatedAt, Author)  
✅ **Soft Delete Support**: IsDeleted flag with composite index for safe deletion  
✅ **Default Values**: CreatedAt and IsDeleted have sensible defaults  
✅ **UTC Timestamps**: Uses `GETUTCDATE()` for timezone-safe timestamps  
✅ **Comments**: Each property documented for clarity  
✅ **Naming Conventions**: Index names follow SQL naming standards (IX_ prefix)  
✅ **Performance**: Descending CreatedAt index matches query patterns  

## Summary Table

| Property | Required | Max Length | Default | Purpose |
|----------|----------|-----------|---------|---------|
| Id | ✓ | - | Auto-increment | Primary key |
| Title | ✓ | 500 | - | Book title (unique check) |
| Author | ✓ | 200 | - | Author name |
| PageCount | ✓ | - | - | Number of pages |
| ReleaseDate | ✓ | - | - | Publication date |
| About | ✓ | 2000 | - | Description |
| Poster | ✓ | 500 | - | Local image path |
| DownloadLink | ✓ | 1000 | - | Cloudinary URL |
| SaveLocation | ✓ | 300 | - | Cloudinary public ID |
| CreatedAt | ✓ | - | GETUTCDATE() | Timestamp |
| IsDeleted | ✓ | - | false | Soft delete flag |

