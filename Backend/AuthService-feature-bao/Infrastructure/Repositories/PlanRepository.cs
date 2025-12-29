using Application.Commons.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class PlanRepository : IPlanRepository
    {
        private readonly ApplicationDbContext _context;
        public PlanRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Plan> GetById(string id)
        {
            return await _context.Plans.FindAsync(id);
        }
    }
}
