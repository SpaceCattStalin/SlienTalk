using Application.Commons.DTOs;
using Domain.Entities;
using FluentResults;
using Microsoft.AspNetCore.Identity;

namespace Application.Commons.Interfaces.Services
{
    public interface IAuthService
    {
        Task<Result<bool>> ValidateResetPasswordTokenAsync(string email, string token);
        Task<Result<bool>> ResetPasswordAsync(string email, string token, string newPassword);
        Task<RegisterResult> RegisterUserAsync(string email, string password);
        Task<LoginResult> LoginUserAsync(string email, string password);
        Task<Result<bool>> LogoutAsync(string userId);
        Task<Result<bool>> RequestPasswordChange(string email);
        //Task<UpdateUserResponse> UpdateUserAsync(Guid userId, UpdateUserRequest request);
        //Task<Result<bool>> LoginWithExternalAsync(string provider, string accessToken);
    }
}
