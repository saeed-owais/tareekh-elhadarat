using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyDAL.Models;

namespace ModawantyDAL.Data.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);


            /*
            // Seed 15 categories (disabled)
            builder.HasData(
                new Category { Id = 1, Name = "تكنولوجيا", IsAvailable = true },
                new Category { Id = 2, Name = "العلوم", IsAvailable = true },
                new Category { Id = 3, Name = "الأعمال", IsAvailable = true },
                new Category { Id = 4, Name = "الصحة", IsAvailable = true },
                new Category { Id = 5, Name = "التعليم", IsAvailable = true },
                new Category { Id = 6, Name = "الرياضة", IsAvailable = true },
                new Category { Id = 7, Name = "الترفيه", IsAvailable = true },
                new Category { Id = 8, Name = "السفر", IsAvailable = true },
                new Category { Id = 9, Name = "الطعام", IsAvailable = true },
                new Category { Id = 10, Name = "الموضة", IsAvailable = true },
                new Category { Id = 11, Name = "نمط الحياة", IsAvailable = true },
                new Category { Id = 12, Name = "السياسة", IsAvailable = true },
                new Category { Id = 13, Name = "الثقافة", IsAvailable = true },
                new Category { Id = 14, Name = "البيئة", IsAvailable = true },
                new Category { Id = 15, Name = "الابتكار", IsAvailable = true }
            );
            */
        }
    }
}
