using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyDAL.Models;

namespace ModawantyDAL.Data.Configurations
{
    public class UserSavedArticleConfiguration : IEntityTypeConfiguration<UserSavedArticle>
    {
        public void Configure(EntityTypeBuilder<UserSavedArticle> builder)
        {
            // Primary Key
            builder.HasKey(usa => usa.Id);

            // Foreign Keys
            builder.HasOne(usa => usa.ApplicationUser)
                .WithMany(u => u.SavedArticles)
                .HasForeignKey(usa => usa.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(usa => usa.Article)
                .WithMany(a => a.SavedByUsers)
                .HasForeignKey(usa => usa.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);


            // Index for querying saved articles by user efficiently
            builder.HasIndex(usa => usa.UserId)
                .HasDatabaseName("IX_UserSavedArticles_UserId");

            // Index for querying saved counts by article
            builder.HasIndex(usa => usa.ArticleId)
                .HasDatabaseName("IX_UserSavedArticles_ArticleId");

            // Unique constraint to prevent duplicate saves (user can save same article only once)
            builder.HasIndex(usa => new { usa.UserId, usa.ArticleId })
                .IsUnique()
                .HasDatabaseName("IX_UserSavedArticles_UserId_ArticleId_Unique");
        }
    }
}
