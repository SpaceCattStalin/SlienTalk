using Domain.Entities;

namespace Application.Commons.Interfaces.Repositories
{
    public interface IPlanRepository
    {
        Task<Plan> GetById(string id);
    }
}
