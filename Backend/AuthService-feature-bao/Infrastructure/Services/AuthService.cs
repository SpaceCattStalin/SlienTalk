using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public sealed class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;
        public AuthService(UserManager<User> userManager, ITokenService tokenService, ILogger<AuthService> logger, IEmailService emailService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _logger = logger;
            _emailService = emailService;
        }
        public async Task<LoginResult> LoginUserAsync(string email, string password)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);

                var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);

                // Validate user and password
                if (user == null || !isPasswordValid)
                {
                    return new LoginFailure("Email hoặc mật khẩu không đúng.");
                }

                var accessTokenResult = _tokenService.GenerateAccessToken(user);
                if (accessTokenResult.IsFailed)
                {
                    return new LoginFailure("Failed to generate access token.");
                }


                var tokenExists = await _tokenService.TokenExist(user.Id.ToString());
                if (!tokenExists)
                {
                    var refreshTokenResult = _tokenService.GenerateRefreshToken(user);
                    if (refreshTokenResult.IsFailed)
                    {
                        return new LoginFailure("Failed to generate refresh token.");
                    }

                    var result = await _tokenService.StoreRefreshTokenAsync(user.Id.ToString(), refreshTokenResult.Value);
                    if (result.IsFailed)
                    {
                        return new LoginFailure("Failed to store refresh token.");
                    }
                }

                return new LoginSuccess(accessTokenResult.Value);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while logging in user with email {Email}", email);
                return new LoginFailure($"An error occurred while logging in: {ex.Message}");
            }
        }

        public async Task<Result<bool>> LogoutAsync(string userId)
        {
            try
            {
                var result = await _tokenService.RevokeRefreshTokenAsync(userId);

                if (result.IsFailed)
                {
                    return Result.Fail<bool>("Refresh token not found or already revoked");
                }

                return Result.Ok(true).WithSuccess("Logged out successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while revoking refresh token");
                return Result.Fail<bool>($"An error occurred while logging out: {ex.Message}");
            }
        }

        /// <summary>
        /// Registers a new user with the provided email and password.
        /// </summary>
        /// <param name="email">User email</param>
        /// <param name="password">Unhashed password</param>
        /// <returns>Result indicating success or failure of registration</returns>
        public async Task<RegisterResult> RegisterUserAsync(string email, string password)
        {
            try
            {
                var userExists = await _userManager.FindByEmailAsync(email);

                if (userExists != null)
                {
                    return new RegisterFailure("Người dùng với email này đã tồn tại");
                }

                var newUserResult = User.Create(email, password);

                if (newUserResult.IsFailed)
                {
                    _logger.LogError("User creation failed: {Errors}",
                        string.Join(", ", newUserResult.Errors.Select(e => e.Message)));
                    return new RegisterFailure("Tạo người dùng thất bại");
                }

                var newUser = newUserResult.Value;

                newUser.UserName = email;

                var identityResult = await _userManager.CreateAsync(newUser, password);

                if (!identityResult.Succeeded)
                {
                    _logger.LogError("User creation failed: {Errors}",
                        string.Join(", ", identityResult.Errors.Select(e => e.Description)));
                    var error = string.Join(", ", identityResult.Errors.Select(e => e.Description));
                    return new RegisterFailure($"Tạo người dùng thất bại");
                }

                return new RegisterSuccess("Đăng kí thành công", newUser.Id.ToString());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user with email {Email}", email);
                return new RegisterFailure($"Lỗi không xác định khi tạo người dùng. {ex}");
            }
        }


        public async Task<Result<bool>> RequestPasswordChange(string email)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return Result.Fail("UserNotFound").WithError("User not found");
                }

                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

                if (string.IsNullOrEmpty(resetToken))
                {
                    return Result.Fail("Failed to generate reset token");
                }

                var emailValid = await _emailService.HasValidMxRecordAsync(email);

                if (!emailValid)
                {
                    return Result.Fail("InvalidEmail").WithError("The provided email address is invalid or does not have a valid MX record.");
                }

                await _emailService.SendResetPasswordEmailAsync(email, resetToken);

                return Result.Ok(true).WithSuccess("Password change request successful.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while requesting password change for user with email {Email}", email);
                return Result.Fail<bool>($"An error occurred while requesting password change: {ex.Message}");
            }
        }

        public async Task<Result<bool>> ResetPasswordAsync(string email, string token, string newPassword)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return Result.Fail("UserNotFound").WithError("User not found");
                }

                var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

                if (!result.Succeeded)
                {
                    return Result.Fail("ResetPasswordFailed")
                        .WithError(string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                return Result.Ok(true).WithSuccess("Password reset successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while resetting password for user with email {Email}", email);
                return Result.Fail<bool>($"An error occurred while resetting the password: {ex.Message}");
            }
        }
        public async Task<Result<bool>> ValidateResetPasswordTokenAsync(string email, string token)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(token))
                {
                    return Result.Fail<bool>("EmptyRequest").WithError("Email and token must be provided.");
                }

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                    return Result.Fail<bool>("UserNotFound").WithError("User does not exist for the email.");

                var isValid = await _userManager.VerifyUserTokenAsync(
                    user,
                    _userManager.Options.Tokens.PasswordResetTokenProvider,
                    "ResetPassword",
                    token
                );

                return isValid
                    ? Result.Ok(true).WithSuccess("Token is valid.")
                    : Result.Fail("PasswordResetTokenExpired").WithError("Invalid or expired reset password token.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating reset password token for {Email}", email);
                return Result.Fail("Failed to validate reset password token.");
            }
        }
    }
}
