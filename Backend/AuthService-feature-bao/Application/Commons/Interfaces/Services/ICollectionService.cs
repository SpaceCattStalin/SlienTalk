using Application.Commons.DTOs;

namespace Application.Commons.Interfaces.Services
{
    public interface ICollectionService
    {
        Task CreateDefaultCollectionAsync(string userId);
        Task<IEnumerable<RelatedSignWordDto>> GetRelatedWordsAsync(string signWordId);

    }
}
