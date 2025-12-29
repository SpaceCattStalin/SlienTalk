using Application.Commons.DTOs;
using Domain.Entities;
using FluentResults;

namespace Application.Commons.Interfaces.Services
{
    public interface ITokenService
    {
        Result<string> GenerateAccessToken(User user);
        Result<string> GenerateRefreshToken(User user);
        Task<Result<string>> GenerateResetPasswordToken(User user);
        Task<Result<bool>> StoreRefreshTokenAsync(string userId, string refreshToken);
        Task<Result<bool>> RevokeRefreshTokenAsync(string userId);
        Task<TokenResult> RefreshAccessTokenAsync(string userId);
        Task<Result<bool>> ValidateRefreshTokenAsync(string userId);
        Task<bool> TokenExist(string userId);
    }
}
