using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "019a0ee5-cea2-7ffa-9ebe-27d88ee5d111", "019a0ee5-csqw-721a-9ege-27d88ee5d111", "Admin", "ADMIN" },
                    { "019a0ee5-cea2-7ffa-9ebe-27d9dad81e83", "019a0qqw-csqw-721a-9ege-27dhjee5d231", "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "019a0ee5-cea2-7ffa-9ebe-27d88ee5d111");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "019a0ee5-cea2-7ffa-9ebe-27d9dad81e83");
        }
    }
}
