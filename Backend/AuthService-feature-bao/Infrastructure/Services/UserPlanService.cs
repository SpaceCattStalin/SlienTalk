using Application.Commons.Interfaces.Repositories;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Repositories;

namespace Infrastructure.Services
{
    public class UserPlanService : IUserPlanService
    {
        private readonly IUserPlanRepository _repository;

        public UserPlanService(IUserPlanRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserPlan> AddPlan(UserPlan plan)
        {
            var existingPlan = await _repository.GetActivePlanByUser(plan.UserId);

            if (existingPlan != null)
            {
                existingPlan.IsActive = false;
                existingPlan.UpdatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                await _repository.UpdateAsync(existingPlan);
            }

            plan.CreatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            plan.UpdatedAt = plan.CreatedAt;

            var addedPlan = await _repository.AddAsync(plan);

            return addedPlan;
        }

        public async Task<UserPlan?> GetByIdAsync(string userPlanId)
        {
            return await _repository.GetByIdAsync(userPlanId);
        }

        public async Task<UserPlan?> GetCurrentPlan(Guid userId)
        {
            return await _repository.GetActivePlanByUser(userId);
        }

        public async Task<int> UpdateUserPlan(UserPlan plan)
        {
            return await _repository.UpdateAsync(plan);
        }
    }
}
