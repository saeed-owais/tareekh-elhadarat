using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyDAL.Models;

namespace ModawantyDAL.Data.Configurations
{
    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            // --- Create Default Admin User ---
            var adminUserId = "019a0ee5-cea2-7ffa-abcd-27d88ee5d222";
            var adminRoleId = "019a0ee5-cea2-7ffa-9ebe-27d88ee5d111";
            var userRoleId = "019a0ee5-cea2-7ffa-9ebe-27d9dad81e83";

            var Password = "Admin25@";

            var defaultAdminUser = new ApplicationUser
            {
                Id = adminUserId,
                UserName = "moaz25",
                Email = "tareekhalshoob@gmail.com",
                NormalizedUserName = "MOAZ25",
                NormalizedEmail = "TAREEKHALSHOOB@GMAIL.COM",
                EmailConfirmed = true,
                PasswordHash = "AQAAAAIAAYagAAAAEOYrXxnIqTyP8L7E3J4G0DQ1lmqWbXxJ8K9Z2lV5pN6M1nW3sY7Z8aB9cD0eF1gH2i==",
                SecurityStamp = "2892fadd-531d-4146-af12-652c98e3a795",
                ConcurrencyStamp = "066a3373-4233-4400-978a-9c12adf9911d",
                PhoneNumber = null,
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                LockoutEnd = null,
                AccessFailedCount = 0,
                FirstName = "moaz",
                LastName = ""
            };

            // --- Seed Admin User to Admin and User Roles ---
            var adminUserRoleAdmin = new IdentityUserRole<string>
            {
                UserId = adminUserId,
                RoleId = adminRoleId
            };

            var adminUserRoleUser = new IdentityUserRole<string>
            {
                UserId = adminUserId,
                RoleId = userRoleId
            };

            builder.HasData(defaultAdminUser);

            // Seed the user-role relationships
            builder.HasMany<IdentityRole>()
                .WithMany()
                .UsingEntity<IdentityUserRole<string>>(
                    l => l.HasOne<IdentityRole>().WithMany().HasForeignKey(ur => ur.RoleId),
                    r => r.HasOne<ApplicationUser>().WithMany().HasForeignKey(ur => ur.UserId))
                .HasData(adminUserRoleAdmin, adminUserRoleUser);

        }
    }
}
