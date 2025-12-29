//using Application.Commons.DTOs;
//using Application.Commons.Interfaces.Services;
//using Domain.Entities;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Security.Claims;

//namespace API.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class UserPlanController : Controller
//    {
//        private readonly IUserPlanService _userPlanService;

//        public UserPlanController(IUserPlanService userPlanService)
//        {
//            _userPlanService = userPlanService;
//        }

//        [Authorize(AuthenticationSchemes = "Bearer")]
//        [HttpPost("assign")]
//        public async Task<IActionResult> AssignPlan([FromBody] AssignPlanRequestDto request)
//        {
//            try
//            {
//                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
//                if (string.IsNullOrEmpty(userIdStr))
//                    return Unauthorized("User ID not found in token");

//                var userId = Guid.Parse(userIdStr);

//                var newPlan = new UserPlan
//                {
//                    UserPlanId = Guid.NewGuid().ToString(),
//                    UserId = userId,
//                    PlanId = request.PlanId
//                };

//                var addedPlan = await _userPlanService.AddPlan(newPlan);

//                var response = new AssignPlanResponseDto
//                {
//                    UserPlanId = addedPlan.UserPlanId,
//                    PlanId = addedPlan.PlanId,
//                    PlanName = addedPlan.Plan?.Name ?? string.Empty,
//                    IsActive = addedPlan.IsActive,
//                    StartDate = addedPlan.StartDate,
//                    EndDate = addedPlan.EndDate
//                };

//                return Ok(new
//                {
//                    IsSuccess = true,
//                    Message = "Cập nhật gói đăng kí thành công",
//                    Data = response
//                });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    IsSuccess = false,
//                    Message = $"Lỗi cập nhật gói đăng kí: {ex.Message}"
//                });
//            }
//        }
//    }
//}
