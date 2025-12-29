using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<SignWord> SignWords { get; set; }
        public DbSet<SignWordCollection> SignWordCollections { get; set; }
        public DbSet<SignWordCollectionSignWord> SignWordCollectionSignWords { get; set; }
        public DbSet<LegacyUserAccount> LegacyUserAccounts { get; set; }
        public DbSet<RelatedSignWord> RelatedSignWords { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<UserPlan> UserPlans { get; set; }
        public DbSet<Plan> Plans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Ignore<Domain.Shared.BaseEvent>();
            modelBuilder.Entity<RelatedSignWord>()
            .HasOne(r => r.SignWord)
            .WithMany()
            .HasForeignKey(r => r.SignWordId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RelatedSignWord>()
                .HasOne(r => r.RelatedSignWordRef)
                .WithMany()
                .HasForeignKey(r => r.RelatedSignWordId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
