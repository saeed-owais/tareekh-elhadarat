using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyDAL.Models;

namespace ModawantyDAL.Data.Configurations
{
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(100);


            /*
            // Seed 15 tags (disabled)
            builder.HasData(
                new Tag { Id = 1, Name = "برمجة", IsAvailable = true },
                new Tag { Id = 2, Name = "تصميم", IsAvailable = true },
                new Tag { Id = 3, Name = "تسويق", IsAvailable = true },
                new Tag { Id = 4, Name = "إدارة", IsAvailable = true },
                new Tag { Id = 5, Name = "استثمار", IsAvailable = true },
                new Tag { Id = 6, Name = "ريادة الأعمال", IsAvailable = true },
                new Tag { Id = 7, Name = "تدريب", IsAvailable = true },
                new Tag { Id = 8, Name = "مهارات", IsAvailable = true },
                new Tag { Id = 9, Name = "قيادة", IsAvailable = true },
                new Tag { Id = 10, Name = "ابتكار", IsAvailable = true },
                new Tag { Id = 11, Name = "استراتيجية", IsAvailable = true },
                new Tag { Id = 12, Name = "تطوير", IsAvailable = true },
                new Tag { Id = 13, Name = "تحليل", IsAvailable = true },
                new Tag { Id = 14, Name = "بحث", IsAvailable = true },
                new Tag { Id = 15, Name = "توعية", IsAvailable = true }
            );
            */
        }
    }
}
