using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _env;

        public UserController(IUserService userService, IWebHostEnvironment env)
        {
            _userService = userService;
            _env = env;
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("get-by-id")]
        public async Task<ActionResult<UserInfo>> GetById(string? id)
        {
            try
            {
                var owner = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

                if (owner == null || !Guid.TryParse(owner, out var userId))
                {
                    return Unauthorized(new { IsSuccess = false, ErrorMessage = "Phiên đăng nhặp hết hạn." });
                }
                Guid finalId = Guid.TryParse(id, out var inputId) ? inputId : userId;

                var result = await _userService.GetUserInfo(finalId);

                if (result == null)
                {
                    return NotFound(new { Message = "Không tìm thấy thông tin người dùng này!" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    IsSuccess = false,
                    Message = "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
                });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut("update-profile")]
        public async Task<ActionResult<UserInfo>> UpdateProfile([FromBody] UpdateUserRequest request)
        {
            try
            {
                var owner = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

                if (owner == null || !Guid.TryParse(owner, out var userId))
                {
                    return Unauthorized(new { IsSuccess = false, ErrorMessage = "Phiên đăng nhặp hết hạn." });
                }

                var result = await _userService.UpdateUser(userId, request);

                if (result.IsSuccess)
                {
                    return Ok(result.UserInfo);
                }

                return BadRequest(new
                {
                    result.IsSuccess,
                    result.ErrorMessage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    IsSuccess = false,
                    Message = "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
                });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("profile-image")]
        public async Task<ActionResult<ImageResponseDto>> UploadProfileImage(IFormFile formFile)
        {
            try
            {

                var owner = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

                var uploadPath = Path.Combine(_env.ContentRootPath, "Images");

                var fileName = $"{owner}{Path.GetExtension(formFile.FileName)}";
                var fullPath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await formFile.CopyToAsync(stream);
                }


                var url = $"{Request.Scheme}://{Request.Host}/Images/{fileName}";

                var result = await _userService.UpdateUser(Guid.Parse(owner), url);

                return Ok(new
                {
                    IsSuccess = true,
                    Message = "Upload thành công",
                    ImageUrl = url
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    IsSuccess = false,
                    Message = "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
                });
            }
        }
    }
}
