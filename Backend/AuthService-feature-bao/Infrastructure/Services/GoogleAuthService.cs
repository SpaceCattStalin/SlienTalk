using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using FluentResults;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Infrastructure.Services
{
    public sealed class GoogleAuthService : IExternalAuthService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        public GoogleAuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public Result<string> GenerateAuthUrl()
        {
            var baseUrl = _configuration["Google:AuthEndpoint"];
            var googleClientId = _configuration["Authentication:Google:ClientId"];
            var redirectUri = _configuration["Google:RedirectUri"];

            if (string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(googleClientId) || string.IsNullOrEmpty(redirectUri))
            {
                return Result.Fail("Google authentication configuration is incomplete.");
            }

            var scope = "openid profile email";
            var responseType = "code";
            var state = Guid.NewGuid().ToString("N");

            var url = $"{baseUrl}" +
                      $"?client_id={googleClientId}" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&response_type={responseType}" +
                      $"&scope={Uri.EscapeDataString(scope)}" +
                      $"&state={state}";

            return Result.Ok(url);
        }

        public async Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string authorizationCode)
        {
            var googleClientId = _configuration["Authentication:Google:ClientId"] ?? throw new InvalidOperationException("Google ClientId is missing in configuration");
            var googleClientSecret = _configuration["Authentication:Google:ClientSecret"] ?? throw new InvalidOperationException("Google ClientSecret is missing in configuration");
            var redirectUri = _configuration["Google:RedirectUri"] ?? throw new InvalidOperationException("Redirect URI is missing in configuration");
            var tokenEndpoint = _configuration["Google:TokenEndpoint"] ?? throw new InvalidOperationException("Token endpoint is missing in configuration");

            try
            {
                var tokenRequest = new Dictionary<string, string>
                {
                    { "code", authorizationCode },
                    { "client_id", googleClientId },
                    { "client_secret", googleClientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                };

                var response = await _httpClientFactory.CreateClient().PostAsync(tokenEndpoint, new FormUrlEncodedContent(tokenRequest));

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return OAuthTokenResponse.Failed(new Exception($"Failed to exchange code for token: {errorContent}"));
                }

                using var jsonDoc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());

                var tokenResponse = OAuthTokenResponse.Success(jsonDoc);

                return tokenResponse;
            }
            catch (Exception ex)
            {
                return OAuthTokenResponse.Failed(ex);
            }
        }

        public async Task<Result<SocialUserInfo>> GetSocialUserInfo(string accessToken)
        {
            var userInfoEndpoint = _configuration["Google:UserInfoEndpoint"] ?? throw new InvalidOperationException("User info endpoint is missing in configuration");

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var response = await client.GetAsync(userInfoEndpoint);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return Result.Fail($"Failed to retrieve user info: {errorContent}");
                }

                var userInfoJson = await response.Content.ReadAsStringAsync();

                var userInfo = JsonSerializer.Deserialize<SocialUserInfo>(userInfoJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return Result.Ok(userInfo!);
            }
            catch (Exception ex)
            {
                return Result.Fail<SocialUserInfo>("Error retrieving Google user info: " + ex.Message);
            }
        }
    }
}
