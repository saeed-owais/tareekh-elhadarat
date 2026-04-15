using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ModawantyBLL.enums;

namespace ModawantyDAL.Data.Configurations
{
    public class IdentityConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            // --- Create Admin Role ---
            var adminRoleId = "019a0ee5-cea2-7ffa-9ebe-27d88ee5d111";
            var adminRole = new IdentityRole
            {
                Id = adminRoleId,
                Name = DefaultRoles.Admin,
                NormalizedName = DefaultRoles.Admin.ToUpper(),
                ConcurrencyStamp = "019a0ee5-csqw-721a-9ege-27d88ee5d111"
            };

            // --- Create Default Role ---
            var defaultRoleId = "019a0ee5-cea2-7ffa-9ebe-27d9dad81e83";
            var defaultRole = new IdentityRole()
            {
                Id = defaultRoleId,
                Name = DefaultRoles.Member,
                NormalizedName = DefaultRoles.Member.ToUpper(),
                ConcurrencyStamp = "019a0qqw-csqw-721a-9ege-27dhjee5d231"
            };

            builder.HasData(adminRole, defaultRole);
        }
    }
}
