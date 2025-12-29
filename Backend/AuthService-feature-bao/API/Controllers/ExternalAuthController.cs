using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalAuthController : ControllerBase
    {
        private readonly ISocialAuthFactory _factory;
        private readonly UserManager<User> _userManager;
        private readonly ITokenService _tokenService;
        public ExternalAuthController(ISocialAuthFactory factory, UserManager<User> userManager, ITokenService tokenService)
        {
            _factory = factory;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpGet("login/{provider}")]
        public IActionResult Login(string provider)
        {
            try
            {
                var authService = _factory.Get(provider);

                var result = authService.GenerateAuthUrl();

                if (result.IsFailed)
                {
                    return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Message)) });
                }

                return Ok(new { IsSuccess = true, AuthUrl = result.Value });
            }
            catch (Exception ex)
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }

        [HttpGet("callback/{provider}")]
        public async Task<IActionResult> Callback(string provider, [FromQuery] string code, [FromQuery] string? state = "")
        {
            try
            {
                string accessToken;
                string refreshToken;
                var authService = _factory.Get(provider);

                var tokenResponse = await authService.ExchangeCodeForTokenAsync(code);

                if (tokenResponse.Error != null)
                {
                    return BadRequest(new { IsSuccess = false, ErrorMessage = tokenResponse.Error });
                }

                var userInfo = await authService.GetSocialUserInfo(tokenResponse.AccessToken!);

                if (userInfo.IsFailed || string.IsNullOrWhiteSpace(userInfo.Value.Email))
                {
                    var userByLogin = await _userManager.FindByLoginAsync("Zalo", userInfo.Value.Id);

                    if (userByLogin != null)
                    {
                        accessToken = _tokenService.GenerateAccessToken(userByLogin).Value;
                        refreshToken = _tokenService.GenerateRefreshToken(userByLogin).Value;

                        await _tokenService.StoreRefreshTokenAsync(userByLogin.Id.ToString(), refreshToken);

                        return Ok(new
                        {
                            IsSuccess = true,
                            AccessToken = accessToken,
                        });
                    }

                    var parsedId = Utilities.GenerateGuidFromString(userInfo.Value.Id ?? userInfo.Value.Sub);

                    var newUser = Domain.Entities.User.Create(id: parsedId);
                    newUser.Value.UserName = $"zalo_{userInfo.Value.Id ?? userInfo.Value.Sub}";

                    var userExist = await _userManager.FindByNameAsync(newUser.Value.UserName);
                    if (userExist == null)
                    {
                        var result = await _userManager.CreateAsync(newUser.Value);
                        if (!result.Succeeded)
                        {
                            return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Description)) });
                        }

                        await _userManager.AddLoginAsync(newUser.Value, new UserLoginInfo("Zalo", userInfo.Value.Id ?? userInfo.Value.Sub, "Zalo"));
                    }

                    accessToken = _tokenService.GenerateAccessToken(newUser.Value).Value;
                    refreshToken = _tokenService.GenerateRefreshToken(newUser.Value).Value;

                    await _tokenService.StoreRefreshTokenAsync(newUser.Value.Id.ToString(), refreshToken);

                    return Ok(new
                    {
                        IsSuccess = true,
                        AccessToken = accessToken,
                    });
                }

                var user = await _userManager.FindByEmailAsync(userInfo.Value.Email);

                if (user == null)
                {
                    var parsedId = Utilities.GenerateGuidFromString(userInfo.Value.Id ?? userInfo.Value.Sub);

                    var newUser = Domain.Entities.User.Create(id: parsedId);
                    if (newUser.IsFailed)
                    {
                        return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", newUser.Errors.Select(e => e.Message)) });
                    }

                    newUser.Value.UserName = userInfo.Value.Email;
                    newUser.Value.Email = userInfo.Value.Email;

                    var userExist = await _userManager.FindByNameAsync(newUser.Value.UserName);
                    if (userExist == null)
                    {
                        //return BadRequest(new { IsSuccess = false, ErrorMessage = "User already exists." });
                        var result = await _userManager.CreateAsync(newUser.Value);

                        if (result.Succeeded == false)
                        {
                            return BadRequest(new { IsSuccess = false, ErrorMessage = string.Join(". ", result.Errors.Select(e => e.Description)) });
                        }
                        await _userManager.AddLoginAsync(
                        newUser.Value,
                        new UserLoginInfo(
                           char.ToUpper(provider[0]) + provider.Substring(1),
                           //userInfo.Value.Id ?? userInfo.Value.Sub,
                           parsedId.ToString(),
                           char.ToUpper(provider[0]) + provider.Substring(1)
                            )
                        );
                    }

                    accessToken = _tokenService.GenerateAccessToken(newUser.Value).Value;
                    refreshToken = _tokenService.GenerateRefreshToken(newUser.Value).Value;

                    await _tokenService.StoreRefreshTokenAsync(newUser.Value.Id.ToString(), refreshToken);

                    return Ok(new
                    {
                        IsSuccess = true,
                        AccessToken = accessToken,
                    });
                }
                else
                {
                    accessToken = _tokenService.GenerateAccessToken(user).Value;
                    refreshToken = _tokenService.GenerateRefreshToken(user).Value;

                    await _tokenService.StoreRefreshTokenAsync(user.Id.ToString(), refreshToken);

                    return Ok(new
                    {
                        IsSuccess = true,
                        AccessToken = accessToken,
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }
    }
}
