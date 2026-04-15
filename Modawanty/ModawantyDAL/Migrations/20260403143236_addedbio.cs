using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class addedbio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "AspNetUsers",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "019a0ee5-cea2-7ffa-abcd-27d88ee5d222",
                column: "Bio",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "AspNetUsers");
        }
    }
}
