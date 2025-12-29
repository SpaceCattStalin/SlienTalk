using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");

            // Primary key
            builder.HasKey(p => p.PaymentId);

            // Properties
            builder.Property(p => p.PaymentId)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(p => p.UserPlanId)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(p => p.Amount)
                   .IsRequired()
                   .HasColumnType("decimal(18,2)");

            builder.Property(p => p.Currency)
                   .IsRequired()
                   .HasMaxLength(10);

            builder.Property(p => p.PaymentDate)
                   .IsRequired();

            builder.Property(p => p.Status)
                   .IsRequired();

            builder.Property(p => p.PaymentMethod)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(p => p.CreatedAt)
                   .HasColumnType("int")
                   .IsRequired();
            builder.Property(p => p.UpdateAt)
                   .HasColumnType("int")
                   .IsRequired();
            // Optional fields
            builder.Property(p => p.FailureReason)
                   .HasMaxLength(500);

            builder.Property(p => p.IsRefunded);

            builder.Property(p => p.RefundedAt);

            builder.Property(p => p.RefundedAmount)
                   .HasColumnType("decimal(18,2)");

            builder.Property(p => p.RefundedStatus)
                   .HasMaxLength(100);

            // Relationships
            builder.HasOne(p => p.UserPlan)
                   .WithMany() // nếu UserPlan có ICollection<Payment> thì đổi thành .WithMany(up => up.Payments)
                   .HasForeignKey(p => p.UserPlanId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
