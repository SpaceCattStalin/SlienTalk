using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using FluentResults;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;
using static System.Formats.Asn1.AsnWriter;

namespace Infrastructure.Services
{
    public sealed class ZaloAuthService : IExternalAuthService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ZaloAuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }
        public Result<string> GenerateAuthUrl()
        {
            var baseUrl = _configuration["Zalo:AuthEndpoint"];
            var zaloClientId = _configuration["Authentication:Zalo:ClientId"];
            var redirectUri = _configuration["Zalo:RedirectUri"];

            if (string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(zaloClientId) || string.IsNullOrEmpty(redirectUri))
            {
                return Result.Fail("Zalo authentication configuration is incomplete.");
            }

            var state = Guid.NewGuid().ToString("N");

            var url = $"{baseUrl}" +
                    $"?app_id={zaloClientId}" +
                    $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                    $"&state={state}";

            return Result.Ok(url);
        }


        public async Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string authorizationCode)
        {
            Console.WriteLine($"Exchanging authorization code: {authorizationCode}");
            var zaloClientId = _configuration["Authentication:Zalo:ClientId"] ?? throw new InvalidOperationException("Zalo ClientId is missing in configuration");
            var zaloClientSecret = _configuration["Authentication:Zalo:ClientSecret"] ?? throw new InvalidOperationException("Zalo ClientSecret is missing in configuration");
            var redirectUri = _configuration["Zalo:RedirectUri"] ?? throw new InvalidOperationException("Redirect URI is missing in configuration");
            var tokenEndpoint = _configuration["Zalo:TokenEndpoint"] ?? throw new InvalidOperationException("Token endpoint is missing in configuration");

            try
            {
                var client = _httpClientFactory.CreateClient();

                client.DefaultRequestHeaders.Add("secret_key", zaloClientSecret);

                var body = new Dictionary<string, string>
                {
                    {"code", authorizationCode },
                    {"app_id", zaloClientId },
                    {"grant_type", "authorization_code" }
                };

                var response = await client.PostAsync(tokenEndpoint, new FormUrlEncodedContent(body));

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
            var userInfoEndpoint = _configuration["Zalo:UserInfoEndpoint"] ?? throw new InvalidOperationException("User info endpoint is missing in configuration");

            try
            {
                var client = _httpClientFactory.CreateClient();
                //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("access_token", accessToken);
                client.DefaultRequestHeaders.Add("access_token", accessToken);

                var response = await client.GetAsync(userInfoEndpoint);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return Result.Fail($"Failed to retrieve user info: {errorContent}");
                }

                var userInfoJson = await response.Content.ReadAsStringAsync();

                var userInfo = JsonSerializer.Deserialize<ZaloUserInfo>(userInfoJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var socialUser = new SocialUserInfo
                {
                    Id = userInfo.Id,
                    Name = userInfo.Name,
                    Picture = userInfo.Picture?.Data.Url ?? string.Empty,
                };

                return Result.Ok(socialUser!);
            }
            catch (Exception ex)
            {
                return Result.Fail<SocialUserInfo>("Error retrieving Zalo user info: " + ex.Message);
            }
        }
    }
}
