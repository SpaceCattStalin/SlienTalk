using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using FluentResults;
using Microsoft.AspNetCore.Authentication.OAuth;

namespace Infrastructure.Services
{
    public class FacebookAuthService : IExternalAuthService
    {
        public Result<string> GenerateAuthUrl()
        {
            throw new NotImplementedException();
        }
        public Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string token)
        {
            throw new NotImplementedException();
        }

        public Task<Result<SocialUserInfo>> GetSocialUserInfo(string accessToken)
        {
            throw new NotImplementedException();
        }
    }
}
