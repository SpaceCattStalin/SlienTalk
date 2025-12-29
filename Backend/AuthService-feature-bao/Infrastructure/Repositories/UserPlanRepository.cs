using Application.Commons.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserPlanRepository : IUserPlanRepository
    {
        private readonly ApplicationDbContext _context;
        public UserPlanRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserPlan> AddAsync(UserPlan plan)
        {
            await _context.UserPlans.AddAsync(plan);
            await _context.SaveChangesAsync();
            return plan;
        }

        public async Task<UserPlan?> GetByIdAsync(string id)
        {
            return await _context.UserPlans
                .Include(p => p.Plan)
                .Include(pm => pm.Payments)
                .FirstOrDefaultAsync(up => up.UserPlanId == id);

        }

        public async Task<IReadOnlyList<UserPlan>> GetPlanByUserAsync(string id)
        {
            return await _context.UserPlans
                .Include(up => up.Plan)
                .Where(up => up.UserPlanId == id)
                .ToListAsync();
        }

        public async Task<int> UpdateAsync(UserPlan plan)
        {
            _context.UserPlans.Update(plan);

            return await _context.SaveChangesAsync();
        }

        public async Task<UserPlan?> GetActivePlanByUser(Guid userId)
        {
            return await _context.UserPlans
                .Include(up => up.Plan)
                .FirstOrDefaultAsync(up => up.UserId == userId && up.IsActive == true);
        }

    }
}
