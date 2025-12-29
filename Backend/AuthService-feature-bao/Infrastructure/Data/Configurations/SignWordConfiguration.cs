using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    internal sealed class SignWordConfiguration : IEntityTypeConfiguration<SignWord>
    {
        public void Configure(EntityTypeBuilder<SignWord> builder)
        {
            builder.HasKey(x => x.SignWordId);

            builder.Property(x => x.SignWordId)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(x => x.Word).HasMaxLength(50);
            builder.Property(x => x.Category).HasMaxLength(50);
            builder.Property(x => x.Definition).HasMaxLength(255);
            builder.Property(x => x.WordType).HasMaxLength(50);
            builder.Property(x => x.SignWordUri).HasMaxLength(50);
            builder.Property(x => x.ExampleSentence).HasMaxLength(50);
            builder.Property(x => x.ExampleSentenceVideoUri).HasMaxLength(50);

            builder.ToTable("SignWord");
        }
    }
}


