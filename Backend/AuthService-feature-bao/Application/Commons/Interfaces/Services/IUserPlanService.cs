using Domain.Entities;

namespace Application.Commons.Interfaces.Services
{
    public interface IUserPlanService
    {
        Task<UserPlan?> GetByIdAsync(string userPlanId);

        Task<UserPlan> AddPlan(UserPlan plan);
        Task<UserPlan?> GetCurrentPlan(Guid userId);
        Task<int> UpdateUserPlan(UserPlan plan);
    }
}
