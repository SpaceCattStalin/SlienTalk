using Application.Commons.Interfaces.Repositories;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenHasher _tokenHasher;
        public RefreshTokenRepository(ApplicationDbContext context, ITokenHasher tokenHasher)
        {
            _context = context;
            _tokenHasher = tokenHasher;
        }

        public async Task<bool> RevokeRefreshTokenAsync(RefreshToken refreshToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (refreshToken == null)
                {
                    return false;
                }
                _context.RefreshTokens.Remove(refreshToken);

                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                throw new Exception("Failed to revoke token due to database error", ex);
            }
        }

        public async Task<bool> StoreAsync(Guid userId, string token, DateTime expiryDate)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var hashedToken = _tokenHasher.HashToken(token);

                var newToken = new RefreshToken
                {
                    UserId = userId,
                    HashedToken = hashedToken,
                    ExpiresAt = expiryDate
                };


                _context.RefreshTokens.Add(newToken);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                throw new Exception("Failed to store token due to database error", ex);
            }
        }

        public async Task<RefreshToken> GetRefreshTokenAsync(string userId)
        {

            return await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == Guid.Parse(userId));
        }
    }
}
