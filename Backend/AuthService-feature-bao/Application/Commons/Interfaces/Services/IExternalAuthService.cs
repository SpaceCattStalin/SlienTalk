using Application.Commons.DTOs;
using FluentResults;
using Microsoft.AspNetCore.Authentication.OAuth;

namespace Application.Commons.Interfaces.Services
{
    public interface IExternalAuthService
    {
        Result<string> GenerateAuthUrl();
        Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string authorizationCode);
        Task<Result<SocialUserInfo>> GetSocialUserInfo(string accessToken);
    }
}
