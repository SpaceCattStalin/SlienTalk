using Application.Commons.DTOs;
using Application.Commons.Interfaces.Repositories;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Infrastructure.Services
{
    public sealed class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TokenService> _logger;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly UserManager<User> _userManager;
        public TokenService(IConfiguration configuration, ILogger<TokenService> logger, IRefreshTokenRepository refreshTokenRepository, UserManager<User> userManager)
        {
            _configuration = configuration;
            _logger = logger;
            _refreshTokenRepository = refreshTokenRepository;
            _userManager = userManager;
        }
        public Result<string> GenerateAccessToken(User user)
        {
            try
            {
                // Get configuration values
                var secretKey = _configuration["Jwt:SecretKey"];

                if (string.IsNullOrEmpty(secretKey))
                {
                    return Result.Fail<string>("JWT secret key is not configured");
                }

                //if (string.IsNullOrEmpty(user.Email))
                //{
                //    return Result.Fail<string>("User email is required to generate access token");
                //}

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var tokenHandler = new JwtSecurityTokenHandler();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(
                    [
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                        new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", user.Id.ToString()),
                        new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "")
                    ]),
                    Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Jwt:ExpirationInMinutes", 60)),
                    SigningCredentials = credentials,
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"]
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Result.Ok(tokenHandler.WriteToken(token)).WithSuccess("Access token generated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating access token for user {Email}", user.Email);
                return Result.Fail("Failed to generate access token.").WithError(ex.Message);
            }
        }

        // Reference: https://www.c-sharpcorner.com/article/implementing-jwt-refresh-tokens-in-net-8-0/
        public Result<string> GenerateRefreshToken(User user)
        {
            try
            {
                var randomNumber = new byte[32];
                using var rng = RandomNumberGenerator.Create();
                rng.GetBytes(randomNumber);
                var refreshToken = Convert.ToBase64String(randomNumber);

                return Result.Ok(refreshToken).WithSuccess("Refresh token generated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating refresh token");
                return Result.Fail($"Failed to generate refresh token. {ex.Message}");
            }
        }

        public async Task<TokenResult> RefreshAccessTokenAsync(string userId)
        {
            try
            {
                var validation = await ValidateRefreshTokenAsync(userId);

                if (validation.IsFailed)
                {
                    return new TokenResult
                    {
                        IsSuccess = false,
                        ErrorMessage = validation.Errors.Select(e => e.Message).Aggregate((current, next) => $"{current}, {next}")
                    };
                }

                var storeToken = await _refreshTokenRepository.GetRefreshTokenAsync(userId);

                var newAccessToken = GenerateAccessToken(storeToken.User);

                return new TokenResult
                {
                    IsSuccess = true,
                    AccessToken = newAccessToken.Value
                };
            }
            catch (Exception ex)
            {
                return new TokenResult
                {
                    IsSuccess = false,
                    ErrorMessage = $"Failed to refresh access token. {ex.Message}"
                };
            }
        }

        public async Task<Result<bool>> RevokeRefreshTokenAsync(string userId)
        {
            try
            {
                var storedToken = await _refreshTokenRepository.GetRefreshTokenAsync(userId);
                var result = await _refreshTokenRepository.RevokeRefreshTokenAsync(storedToken);

                if (!result)
                {
                    _logger.LogError("Failed to revoke refresh token");
                    return Result.Fail<bool>("Failed to revoke refresh token.");
                }

                return Result.Ok(true).WithSuccess("Refresh token revoked successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Result.Fail<bool>($"Failed to revoke refresh token. {ex.Message}");
            }
        }

        public async Task<Result<bool>> ValidateRefreshTokenAsync(string userId)
        {
            try
            {
                var storedToken = await _refreshTokenRepository.GetRefreshTokenAsync(userId);

                if (storedToken == null)
                {
                    _logger.LogWarning("Refresh token has been revoked");
                    return Result.Fail<bool>("Refresh token has been revoked");
                }

                // To-do: Write a Worker Service to delete expired tokens periodically

                if (storedToken.ExpiresAt <= DateTime.UtcNow)
                {
                    _logger.LogWarning("Refresh token has expired");
                    return Result.Fail<bool>("Refresh token has expired");
                }

                return Result.Ok(true).WithSuccess("Refresh token is valid.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating refresh token");
                return Result.Fail<bool>($"Failed to validate refresh token. {ex.Message}");
            }
        }

        public async Task<Result<bool>> StoreRefreshTokenAsync(string userId, string refreshToken)
        {
            try
            {
                var result = await _refreshTokenRepository.StoreAsync(Guid.Parse(userId), refreshToken, DateTime.UtcNow.AddDays(30));
                // Check if storing the refresh token was successful
                // If not, log the error and return a failed login result
                // To-do: Add retry policy
                if (!result)
                {
                    _logger.LogError("Failed to store refresh token for user {UserId}", userId);
                    return Result.Fail<bool>("Failed to store refresh token.");
                }

                return Result.Ok(true).WithSuccess("Refresh token stored successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Result.Fail<bool>("Failed to store refresh token");
            }
        }

        public async Task<bool> TokenExist(string userId)
        {
            var storedToken = await _refreshTokenRepository.GetRefreshTokenAsync(userId);

            return storedToken != null;
        }
        public async Task<Result<string>> GenerateResetPasswordToken(User user)
        {
            try
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                return Result.Ok(token).WithSuccess("Reset password token generated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating reset password token for user {Email}", user.Email);
                return Result.Fail<string>($"Failed to generate reset password token. {ex.Message}");
            }
        }
    }
}
