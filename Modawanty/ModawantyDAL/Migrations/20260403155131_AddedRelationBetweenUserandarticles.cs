using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModawantyDAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedRelationBetweenUserandarticles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserSavedArticles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ArticleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSavedArticles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSavedArticles_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSavedArticles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSavedArticles_ArticleId",
                table: "UserSavedArticles",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSavedArticles_UserId",
                table: "UserSavedArticles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSavedArticles_UserId_ArticleId_Unique",
                table: "UserSavedArticles",
                columns: new[] { "UserId", "ArticleId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSavedArticles");
        }
    }
}
