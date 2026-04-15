using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyDAL.Models;

namespace ModawantyDAL.Data.Configurations
{
    public class ArticleTagConfiguration : IEntityTypeConfiguration<ArticleTag>
    {
        public void Configure(EntityTypeBuilder<ArticleTag> builder)
        {
            builder.HasKey(at => new { at.ArticleId, at.TagId });

            builder.HasOne(at => at.Article)
                .WithMany(a => a.ArticleTags)
                .HasForeignKey(at => at.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(at => at.Tag)
                .WithMany(t => t.ArticleTags)
                .HasForeignKey(at => at.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            /*
            // Seed article-tag relationships (disabled)
            builder.HasData(
                // Article 1: الدولة الأموية والنهضة الحضارية الإسلامية (History, Analysis, Research)
                new ArticleTag { ArticleId = 1, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 1, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 1, TagId = 15 }, // توعية

                // Article 2: الحروب الصليبية وتأثيرها على الشرق الأوسط (History, Analysis, Research)
                new ArticleTag { ArticleId = 2, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 2, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 2, TagId = 15 }, // توعية

                // Article 3: الأدب العربي القديم وتطوره عبر العصور (Research, Awareness, Culture)
                new ArticleTag { ArticleId = 3, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 3, TagId = 15 }, // توعية
                new ArticleTag { ArticleId = 3, TagId = 8 }, // مهارات

                // Article 4: النظام السياسي الإسلامي في العصور الوسطى (Analysis, Research, Innovation)
                new ArticleTag { ArticleId = 4, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 4, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 4, TagId = 10 }, // ابتكار

                // Article 5: الفتوحات الإسلامية وتأثيرها على العالم (History, Analysis, Awareness)
                new ArticleTag { ArticleId = 5, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 5, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 5, TagId = 15 }, // توعية

                // Article 6: الشعر العربي وأغراضه المختلفة (Research, Awareness, Skills)
                new ArticleTag { ArticleId = 6, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 6, TagId = 15 }, // توعية
                new ArticleTag { ArticleId = 6, TagId = 8 }, // مهارات

                // Article 7: الخلافة العباسية وازدهار الحضارة الإسلامية (History, Analysis, Research)
                new ArticleTag { ArticleId = 7, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 7, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 7, TagId = 15 }, // توعية

                // Article 8: النظم السياسية الحديثة والديمقراطية (Analysis, Research, Innovation)
                new ArticleTag { ArticleId = 8, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 8, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 8, TagId = 10 }, // ابتكار

                // Article 9: المقامات والسرد في الأدب العربي (Research, Awareness, Skills)
                new ArticleTag { ArticleId = 9, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 9, TagId = 15 }, // توعية
                new ArticleTag { ArticleId = 9, TagId = 8 }, // مهارات

                // Article 10: الحرية والعدالة في الفكر السياسي الإسلامي (Analysis, Research, Awareness)
                new ArticleTag { ArticleId = 10, TagId = 13 }, // تحليل
                new ArticleTag { ArticleId = 10, TagId = 14 }, // بحث
                new ArticleTag { ArticleId = 10, TagId = 15 } // توعية
            );
            */
        }
    }
}
