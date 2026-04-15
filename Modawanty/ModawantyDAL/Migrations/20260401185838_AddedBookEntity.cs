using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedBookEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, comment: "Book title - must be unique"),
                    Author = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false, comment: "Author name"),
                    PageCount = table.Column<int>(type: "int", nullable: false, comment: "Total number of pages in the book"),
                    ReleaseDate = table.Column<DateOnly>(type: "date", nullable: false, comment: "Original release/publication date"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, comment: "UTC timestamp when book was added to database"),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false, comment: "Soft delete flag - true means book is deleted but data preserved in database"),
                    About = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false, comment: "Book description/synopsis"),
                    Poster = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, comment: "Local path to book poster image (stored in wwwroot/books/)"),
                    SaveLocation = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false, comment: "Cloudinary public ID used to delete the PDF from cloud storage"),
                    DownloadLink = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, comment: "Cloudinary HTTPS URL for downloading the PDF file")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");
        }
    }
}
