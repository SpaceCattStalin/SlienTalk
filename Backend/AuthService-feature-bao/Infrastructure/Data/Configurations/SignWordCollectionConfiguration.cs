using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    internal sealed class SignWordCollectionConfiguration : IEntityTypeConfiguration<SignWordCollection>
    {
        public void Configure(EntityTypeBuilder<SignWordCollection> builder)
        {
            builder.HasKey(x => x.CollectionId);

            builder.Property(x => x.CollectionId)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(x => x.CreatedBy).HasMaxLength(50);
            builder.Property(x => x.Name).HasMaxLength(50);

            builder.ToTable("SignWordCollection");
        }
    }
}


