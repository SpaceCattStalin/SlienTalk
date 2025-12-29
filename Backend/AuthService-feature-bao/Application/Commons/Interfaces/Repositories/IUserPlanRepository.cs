using Domain.Entities;

namespace Application.Commons.Interfaces.Repositories
{
    public interface IUserPlanRepository
    {
        Task<UserPlan?> GetByIdAsync(string id);
        Task<UserPlan> AddAsync(UserPlan plan);
        Task<int> UpdateAsync(UserPlan plan);
        Task<IReadOnlyList<UserPlan>> GetPlanByUserAsync(string id);
        Task<UserPlan> GetActivePlanByUser(Guid userId);
    }
}
