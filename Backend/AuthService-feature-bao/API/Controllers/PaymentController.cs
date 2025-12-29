using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly IPaymentService _paymentService;
        private readonly IUserPlanService _userPlanService;
        private readonly ILogger<PaymentController> _logger;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        public PaymentController(IPaymentService paymentService, IUserPlanService userPlanService, ILogger<PaymentController> logger, IConfiguration configuration, UserManager<User> userManager)
        {
            _paymentService = paymentService;
            _userPlanService = userPlanService;
            _logger = logger;
            _configuration = configuration;
            _userManager = userManager;
        }



        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("zalo/create")]
        //public async Task<ActionResult<CreatePaymentResponse>> CreateZaloOrder([FromBody] CreatePaymentRequest req)
        public async Task<ActionResult> CreateZaloOrder([FromBody] CreatePaymentRequest req)
        {
            try
            {
                if (req == null)
                    return BadRequest(new { message = "Request is NULL (model binding failed)" });

                //var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
                //if (userId != null)
                //    req.UserId = userId;
                //var userId = User.FindFirstValue("sub");
                var userId =
                   User.FindFirstValue("sub")
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
                    ?? User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Token does not contain userId (sub claim missing)" });
                }
                //                var user = await _userManager.FindByIdAsync(userId);

                //return Ok(new
                //{
                //    userId = userId,
                //    userIsNull = user == null
                //});

                //else
                //{
                //    return Ok(new { userId, appId = _configuration["ZaloPay:AppId"], key1 = _configuration["ZaloPay:Key1"], callback = _configuration["ZaloPay:CallbackUrl"] });
                //}

                req.UserId = userId;
                var result = await _paymentService.CreateOrderAsync(req);

                if (result.IsSuccess)
                {
                    return Ok(new CreatePaymentResponse
                    {
                        OrderUrl = result.Data.OrderUrl,
                        ZpTransToken = result.Data.ZpTransToken,
                        Message = result.Data.ReturnMessage
                    });
                }

                return BadRequest(new CreatePaymentResponse
                {
                    OrderUrl = null,
                    ZpTransToken = null,
                    Message = result.Data.ReturnMessage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = ex.Message });
            }
        }

        [HttpPost("zalo/callback")]
        public async Task<IActionResult> Callback()
        {
            try
            {
                var body = await new StreamReader(Request.Body).ReadToEndAsync();

                // Parse JSON vào model
                var callbackRequest = JsonConvert.DeserializeObject<ZaloPayCallbackRequest>(body);
                if (callbackRequest == null)
                {
                    return Ok(new { return_code = 0, return_message = "Invalid callback body" });
                }

                var resultJson = await _paymentService.HandleCallbackAsync(callbackRequest);

                return Content(resultJson, "application/json");
            }
            catch (Exception ex)
            {
                return Ok(new { return_code = 0, return_message = ex.Message });
            }
        }

        [HttpGet("status/{appTransId}")]
        public async Task<IActionResult> CheckStatus(string appTransId)
        {
            try
            {
                var res = await _paymentService.CheckStatus(appTransId);

                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server", detail = ex.Message });
            }
        }
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentPlan()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized("User ID not found in token");

            var userId = Guid.Parse(userIdStr);
            var currentPlan = await _userPlanService.GetCurrentPlan(userId);

            if (currentPlan == null)
                return NotFound(new { Message = "User has no active plan" });

            return Ok(new
            {
                IsSuccess = true,
                Data = new
                {
                    currentPlan.PlanId,
                    currentPlan.Plan.Name,
                    currentPlan.Plan.Price,
                    currentPlan.StartDate,
                    currentPlan.EndDate,
                    currentPlan.IsActive
                }
            });
        }
    }
}
