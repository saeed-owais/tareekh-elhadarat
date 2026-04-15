using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyDAL.Models;

namespace ModawantyDAL.Data.Configurations
{
    /// <summary>
    /// Entity Framework Core configuration for the Book entity
    /// Defines property constraints, indexes, and relationships
    /// </summary>
    public class BookConfiguration : IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder)
        {
            // Primary Key
            builder.HasKey(b => b.Id);

            // Property Configurations
            builder.Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(500)
                .HasComment("Book title - must be unique");

            builder.Property(b => b.Author)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Author name");

            builder.Property(b => b.PageCount)
                .IsRequired()
                .HasComment("Total number of pages in the book");

            builder.Property(b => b.ReleaseDate)
                .IsRequired()
                .HasComment("Original release/publication date");

            builder.Property(b => b.About)
                .IsRequired()
                .HasMaxLength(2000)
                .HasComment("Book description/synopsis");

            builder.Property(b => b.Poster)
                .IsRequired()
                .HasMaxLength(500)
                .HasComment("Local path to book poster image (stored in wwwroot/books/)");

            builder.Property(b => b.DownloadLink)
                .IsRequired()
                .HasMaxLength(1000)
                .HasComment("Cloudinary HTTPS URL for downloading the PDF file");

            builder.Property(b => b.SaveLocation)
                .IsRequired()
                .HasMaxLength(300)
                .HasComment("Cloudinary public ID used to delete the PDF from cloud storage");

            builder.Property(b => b.CreatedAt)
                .IsRequired()
                .HasComment("UTC timestamp when book was added to database");

            builder.Property(b => b.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false)
                .HasComment("Soft delete flag - true means book is deleted but data preserved in database");

            /*
            // Seed initial book data (disabled)
            builder.HasData(
                new Book
                {
                    Id = 1,
                    Title = "Clean Code: A Handbook of Agile Software Craftsmanship",
                    Author = "Robert C. Martin",
                    PageCount = 464,
                    ReleaseDate = new DateOnly(2008, 8, 1),
                    About = "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are spent fixing fragile and broken code. But it doesn't have to be that way.",
                    Poster = "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg",
                    DownloadLink = "uploading",
                    SaveLocation = "pending_upload",
                    CreatedAt = new DateTime(2024, 1, 15, 10, 30, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Book
                {
                    Id = 2,
                    Title = "The Pragmatic Programmer: Your Journey to Mastery",
                    Author = "David Thomas, Andrew Hunt",
                    PageCount = 352,
                    ReleaseDate = new DateOnly(2019, 10, 1),
                    About = "The Pragmatic Programmer is about taking charge of your career. Be pragmatic. Make choices based on analysis and commonsense. Look at the state of the art, but also consider your own needs.",
                    Poster = "https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg",
                    DownloadLink = "uploading",
                    SaveLocation = "pending_upload",
                    CreatedAt = new DateTime(2024, 1, 18, 14, 45, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Book
                {
                    Id = 3,
                    Title = "Design Patterns: Elements of Reusable Object-Oriented Software",
                    Author = "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                    PageCount = 395,
                    ReleaseDate = new DateOnly(1994, 10, 31),
                    About = "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and elegant solutions to commonly occurring design problems.",
                    Poster = "https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg",
                    DownloadLink = "uploading",
                    SaveLocation = "pending_upload",
                    CreatedAt = new DateTime(2024, 1, 20, 9, 15, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Book
                {
                    Id = 4,
                    Title = "Introduction to Algorithms",
                    Author = "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
                    PageCount = 1312,
                    ReleaseDate = new DateOnly(2009, 7, 31),
                    About = "Some books on algorithms are written to teach students. Some are written as reference material. Introduction to Algorithms was conceived as a comprehensive textbook covering the full scope of computer algorithms.",
                    Poster = "https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg",
                    DownloadLink = "uploading",
                    SaveLocation = "pending_upload",
                    CreatedAt = new DateTime(2024, 1, 22, 16, 20, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Book
                {
                    Id = 5,
                    Title = "You Don't Know JS Yet",
                    Author = "Kyle Simpson",
                    PageCount = 432,
                    ReleaseDate = new DateOnly(2020, 1, 28),
                    About = "The You Don't Know JS Yet book series is aimed at everyone seeking to learn and deepen their understanding of the JavaScript programming language. Everyone starts somewhere.",
                    Poster = "https://covers.openlibrary.org/b/isbn/9781492091523-M.jpg",
                    DownloadLink = "uploading",
                    SaveLocation = "pending_upload",
                    CreatedAt = new DateTime(2024, 1, 25, 11, 50, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Book
                {
                    Id = 6,
                    Title = "The Art of Computer Programming",
                    Author = "Donald E. Knuth",
                    PageCount = 883,
                    ReleaseDate = new DateOnly(1997, 6, 15),
                    About = "These seminal works are an essential resource in the personal library of any serious programmer. Countless readers have spoken about the profound personal impact of Knuth's work.",
                    Poster = "https://covers.openlibrary.org/b/isbn/9780201896830-M.jpg",
                    DownloadLink = "uploading",
                    SaveLocation = "pending_upload",
                    CreatedAt = new DateTime(2024, 1, 28, 13, 30, 0, DateTimeKind.Utc),
                    IsDeleted = false
                }
            );
            */
        }
    }
}
