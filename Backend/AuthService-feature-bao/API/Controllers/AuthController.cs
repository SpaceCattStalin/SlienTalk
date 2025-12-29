using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ICollectionService _collectionService;
        private readonly IUserPlanService _userPlanService;
        public AuthController(IAuthService authService, ICollectionService collectionService, IUserPlanService userPlanService)
        {
            _authService = authService;
            _collectionService = collectionService;
            _userPlanService = userPlanService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginUserAsync(request.Email, request.Password);

            return result switch
            {
                LoginSuccess success => Ok(new { success.AccessToken }),
                LoginFailure failure => BadRequest(new { failure.IsSuccess, failure.ErrorMessage }),
                _ => StatusCode(StatusCodes.Status500InternalServerError)
            };
        }

        //[HttpPost("register")]
        //public async Task<IActionResult> Register([FromBody] Application.Commons.DTOs.RegisterRequest request)
        //{
        //    var result = await _authService.RegisterUserAsync(request.Email, request.Password);

        //    //return result switch
        //    //{
        //    //    RegisterSuccess success => Ok(new { success.IsSuccess, success.Message }),
        //    //    RegisterFailure failure => BadRequest(new { failure.IsSuccess, failure.ErrorMessage }),
        //    //    _ => StatusCode(StatusCodes.Status500InternalServerError)
        //    //};


        //    switch (result)
        //    {
        //        case RegisterSuccess success:
        //            await _collectionService.CreateDefaultCollectionAsync(success.UserId.ToString());
        //            var freePlan = new UserPlan
        //            {
        //                UserPlanId = Guid.NewGuid().ToString(),
        //                UserId = Guid.Parse(success.UserId),
        //                PlanId = "FREE",
        //                StartDate = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
        //                EndDate = 0,
        //                IsActive = true,
        //                CreatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
        //                UpdatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds()
        //            };

        //            await _userPlanService.AddPlan(freePlan);

        //            return Ok(new { success.IsSuccess, success.Message });

        //        case RegisterFailure failure:
        //            return BadRequest(new { failure.IsSuccess, failure.ErrorMessage });

        //        default:
        //            return StatusCode(StatusCodes.Status500InternalServerError);
        //    }
        //}
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Application.Commons.DTOs.RegisterRequest request)
        {
            var result = await _authService.RegisterUserAsync(request.Email, request.Password);

            var success = result as RegisterSuccess;
            if (success != null)
            {
                return await HandleRegistrationSuccess(success);
            }

            var failure = result as RegisterFailure;
            if (failure != null)
            {
                return BadRequest(new
                {
                    IsSuccess = failure.IsSuccess,
                    ErrorMessage = failure.ErrorMessage
                });
            }

            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        private async Task<IActionResult> HandleRegistrationSuccess(RegisterSuccess success)
        {
            await _collectionService.CreateDefaultCollectionAsync(success.UserId.ToString());

            var freePlan = new UserPlan
            {
                UserPlanId = Guid.NewGuid().ToString(),
                UserId = Guid.Parse(success.UserId),
                PlanId = "FREE",
                StartDate = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                EndDate = 0,
                IsActive = true,
                CreatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                UpdatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            await _userPlanService.AddPlan(freePlan);

            return Ok(new
            {
                IsSuccess = success.IsSuccess,
                Message = success.Message,
                UserId = success.UserId
            });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = HttpContext.User.Claims.FirstOrDefault()?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "UserId claim is missing. Check if access token is sent." });
            }

            var result = await _authService.LogoutAsync(userId);

            return result.IsSuccess
                ? Ok(new { IsSuccess = true, Message = string.Join(". ", result.Reasons.Select(r => r.Message)) })
                : BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Message)) }); ;
        }

        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService.RequestPasswordChange(request.Email);

            if (result.IsSuccess)
            {
                return Ok(new { IsSuccess = true, Message = "Password reset request successful. Please check your email." });
            }

            return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Message)) });
        }

        //[Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request.Email, request.ResetCode, request.NewPassword);

            if (result.IsFailed)
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Message)) });
            }

            return Ok(new { IsSuccess = true, Message = "Password reset successfully." });
        }

        [HttpPost("validate-reset-token")]
        public async Task<IActionResult> ValidateResetToken([FromBody] ValidateResetTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "Email is missing." });
            }

            var result = await _authService.ValidateResetPasswordTokenAsync(request.Email, request.ResetToken);
            if (result.IsFailed)
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Message)) });
            }
            return Ok(new { IsSuccess = true, Message = "Reset token is valid." });
        }


    }
}
