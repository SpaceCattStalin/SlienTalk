using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    internal sealed class SignWordCollectionSignWordConfiguration : IEntityTypeConfiguration<SignWordCollectionSignWord>
    {
        public void Configure(EntityTypeBuilder<SignWordCollectionSignWord> builder)
        {
            builder.HasKey(x => new { x.CollectionId, x.SignWordId });

            builder.Property(x => x.CollectionId).HasMaxLength(50);
            builder.Property(x => x.SignWordId).HasMaxLength(50);

            builder
                .HasOne(x => x.Collection)
                .WithMany(c => c.SignWords)
                .HasForeignKey(x => x.CollectionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.SignWord)
                .WithMany(w => w.SignWordCollections)
                .HasForeignKey(x => x.SignWordId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable("SignWordCollection_SignWord");
        }
    }
}


