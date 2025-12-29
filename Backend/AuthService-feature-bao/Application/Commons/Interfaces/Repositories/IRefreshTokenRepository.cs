using Domain.Entities;

namespace Application.Commons.Interfaces.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<bool> StoreAsync(Guid userId, string token, DateTime expiryDate);
        Task<bool> RevokeRefreshTokenAsync(RefreshToken refreshToken);
        Task<RefreshToken> GetRefreshTokenAsync(string userId);
    }
}
