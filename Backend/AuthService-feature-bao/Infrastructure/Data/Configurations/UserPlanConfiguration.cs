using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    internal sealed class UserPlanConfiguration : IEntityTypeConfiguration<UserPlan>
    {
        public void Configure(EntityTypeBuilder<UserPlan> builder)
        {
            builder.ToTable("User_Plan");

            builder.HasKey(up => up.UserPlanId);

            builder.Property(up => up.UserPlanId)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(up => up.PlanId)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(up => up.UserId)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(up => up.StartDate);
            builder.Property(up => up.EndDate);
            builder.Property(up => up.CanceledAt);
            builder.Property(up => up.CreatedAt);
            builder.Property(up => up.UpdatedAt);

            builder.Property(up => up.IsActive)
                   .IsRequired();

            builder.HasOne(up => up.Plan)
                   .WithMany(p => p.UserPlans)
                   .HasForeignKey(up => up.PlanId);

            builder.HasOne(up => up.User)
                   .WithMany(u => u.UserPlans)
                   .HasForeignKey(up => up.UserId);

            builder.HasMany(up => up.Payments)
                 .WithOne(p => p.UserPlan)
                 .HasForeignKey(p => p.UserPlanId)
                 .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
