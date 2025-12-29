using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    internal sealed class LegacyUserAccountConfiguration : IEntityTypeConfiguration<LegacyUserAccount>
    {
        public void Configure(EntityTypeBuilder<LegacyUserAccount> builder)
        {
            builder.ToTable("User"); // map tới bảng [User]

            builder.HasKey(x => x.UserId);
            builder.Property(x => x.UserId).HasMaxLength(50).IsRequired();

            builder.Property(x => x.LastName).HasMaxLength(50).IsRequired();
            builder.Property(x => x.FirstName).HasMaxLength(50).IsRequired();
            builder.Property(x => x.PasswordHash).HasMaxLength(50).IsRequired();
            builder.Property(x => x.Email).HasMaxLength(50).IsRequired();
            builder.Property(x => x.CreateDate).HasColumnType("date").IsRequired();
            builder.Property(x => x.PhoneNumber).HasMaxLength(10).IsRequired(false);
        }
    }
}


