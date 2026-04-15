using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedSeedAdminandbooksAndmodifiedUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthorName",
                table: "AspNetUsers",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfilePhoto",
                table: "AspNetUsers",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "AuthorName", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "ProfilePhoto", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "019a0ee5-cea2-7ffa-abcd-27d88ee5d222", 0, null, "066a3373-4233-4400-978a-9c12adf9911d", "Admin25@gmail.com", true, "System", "Admin", true, null, "admin25@gmail.com", "admin25", "AQAAAAIAAYagAAAAEOYrXxnIqTyP8L7E3J4G0DQ1lmqWbXxJ8K9Z2lV5pN6M1nW3sY7Z8aB9cD0eF1gH2i==", null, true, null, "2892fadd-531d-4146-af12-652c98e3a795", false, "Admin25" });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "About", "Author", "CreatedAt", "DownloadLink", "PageCount", "Poster", "ReleaseDate", "SaveLocation", "Title" },
                values: new object[,]
                {
                    { 1, "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are spent fixing fragile and broken code. But it doesn't have to be that way.", "Robert C. Martin", new DateTime(2024, 1, 15, 10, 30, 0, 0, DateTimeKind.Utc), "uploading", 464, "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg", new DateOnly(2008, 8, 1), "pending_upload", "Clean Code: A Handbook of Agile Software Craftsmanship" },
                    { 2, "The Pragmatic Programmer is about taking charge of your career. Be pragmatic. Make choices based on analysis and commonsense. Look at the state of the art, but also consider your own needs.", "David Thomas, Andrew Hunt", new DateTime(2024, 1, 18, 14, 45, 0, 0, DateTimeKind.Utc), "uploading", 352, "https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg", new DateOnly(2019, 10, 1), "pending_upload", "The Pragmatic Programmer: Your Journey to Mastery" },
                    { 3, "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and elegant solutions to commonly occurring design problems.", "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", new DateTime(2024, 1, 20, 9, 15, 0, 0, DateTimeKind.Utc), "uploading", 395, "https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg", new DateOnly(1994, 10, 31), "pending_upload", "Design Patterns: Elements of Reusable Object-Oriented Software" },
                    { 4, "Some books on algorithms are written to teach students. Some are written as reference material. Introduction to Algorithms was conceived as a comprehensive textbook covering the full scope of computer algorithms.", "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein", new DateTime(2024, 1, 22, 16, 20, 0, 0, DateTimeKind.Utc), "uploading", 1312, "https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg", new DateOnly(2009, 7, 31), "pending_upload", "Introduction to Algorithms" },
                    { 5, "The You Don't Know JS Yet book series is aimed at everyone seeking to learn and deepen their understanding of the JavaScript programming language. Everyone starts somewhere.", "Kyle Simpson", new DateTime(2024, 1, 25, 11, 50, 0, 0, DateTimeKind.Utc), "uploading", 432, "https://covers.openlibrary.org/b/isbn/9781492091523-M.jpg", new DateOnly(2020, 1, 28), "pending_upload", "You Don't Know JS Yet" },
                    { 6, "These seminal works are an essential resource in the personal library of any serious programmer. Countless readers have spoken about the profound personal impact of Knuth's work.", "Donald E. Knuth", new DateTime(2024, 1, 28, 13, 30, 0, 0, DateTimeKind.Utc), "uploading", 883, "https://covers.openlibrary.org/b/isbn/9780201896830-M.jpg", new DateOnly(1997, 6, 15), "pending_upload", "The Art of Computer Programming" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "019a0ee5-cea2-7ffa-9ebe-27d88ee5d111", "019a0ee5-cea2-7ffa-abcd-27d88ee5d222" },
                    { "019a0ee5-cea2-7ffa-9ebe-27d9dad81e83", "019a0ee5-cea2-7ffa-abcd-27d88ee5d222" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "019a0ee5-cea2-7ffa-9ebe-27d88ee5d111", "019a0ee5-cea2-7ffa-abcd-27d88ee5d222" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "019a0ee5-cea2-7ffa-9ebe-27d9dad81e83", "019a0ee5-cea2-7ffa-abcd-27d88ee5d222" });

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "019a0ee5-cea2-7ffa-abcd-27d88ee5d222");

            migrationBuilder.DropColumn(
                name: "AuthorName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ProfilePhoto",
                table: "AspNetUsers");
        }
    }
}
