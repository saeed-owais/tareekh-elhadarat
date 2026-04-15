using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class updatedArticleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReadTimeInMiniutes",
                table: "Articles",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 4,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 5,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 6,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 7,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 8,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 9,
                column: "ReadTimeInMiniutes",
                value: null);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "Id",
                keyValue: 10,
                column: "ReadTimeInMiniutes",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadTimeInMiniutes",
                table: "Articles");
        }
    }
}
