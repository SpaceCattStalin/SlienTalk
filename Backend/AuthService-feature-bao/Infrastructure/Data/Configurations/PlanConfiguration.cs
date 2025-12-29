using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    internal sealed class PlanConfiguration : IEntityTypeConfiguration<Plan>
    {
        public void Configure(EntityTypeBuilder<Plan> builder)
        {
            builder.ToTable("Plan");

            builder.HasKey(p => p.PlanId);

            builder.Property(p => p.PlanId)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(p => p.Name)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(p => p.Price)
                   .HasColumnType("decimal(19,4)")
                   .IsRequired();

            builder.Property(p => p.Currency)
                   .HasMaxLength(3)
                   .IsRequired();

            builder.Property(p => p.IsActive)
                   .IsRequired();

            builder.Property(p => p.DurationDays)
                   .HasColumnType("smallint")
                   .IsRequired();

            builder.Property(p => p.CreatedAt)
                   .IsRequired();

            builder.Property(p => p.UpdatedAt)
                   .IsRequired();
        }
    }
}
