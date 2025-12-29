using Application.Commons.DTOs;
using Application.Commons.Interfaces.Repositories;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.External;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly IZaloPayClient _payClient;
        private readonly IUserPlanService _userPlanService;
        private readonly IPaymentRepository _paymentRepository;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IZaloPayClient payClient, IConfiguration configuration, IUserPlanService userPlanService,
            IPaymentRepository paymentRepository, UserManager<User> userManager, ILogger<PaymentService> logger)
        {
            _payClient = payClient;
            _configuration = configuration;
            _userPlanService = userPlanService;
            _paymentRepository = paymentRepository;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<PaymentResult<CreateZaloPayOrderResponse>> CreateOrderAsync(CreatePaymentRequest request)
        {
            string appId = "";
            string key1 = "";
            string callbackUrl = "";
            try
            {
                //var appId = _configuration["ZaloPay:AppId"];
                //var key1 = _configuration["ZaloPay:Key1"];
                //var callbackUrl = _configuration["ZaloPay:CallbackUrl"];
                appId = _configuration["ZaloPay:AppId"];
                key1 = _configuration["ZaloPay:Key1"];
                callbackUrl = _configuration["ZaloPay:CallbackUrl"];
                _logger.LogError("JWT DEBUG: Issuer=" + _configuration["Jwt:Issuer"]);
                _logger.LogError("JWT DEBUG: Audience=" + _configuration["Jwt:Audience"]);
                _logger.LogError("JWT DEBUG: SecretKey=" + _configuration["Jwt:SecretKey"]);

                if (string.IsNullOrEmpty(appId) ||
                    string.IsNullOrEmpty(key1) ||
                    string.IsNullOrEmpty(callbackUrl))
                {
                    //return PaymentResult<CreateZaloPayOrderResponse>.Fail("Missing ZaloPay configuration values");
                    throw new ArgumentException("Missing ZaloPay configuration values");
                }

                string appTransId = $"{DateTime.Now:yyMMdd}_{Guid.NewGuid().ToString("N").Substring(0, 6)}";

                //var user = await _userManager.FindByIdAsync(request.UserId.ToUpper());
                var user = await _userManager.FindByIdAsync(request.UserId);

                if (user == null)
                {
                    throw new InvalidOperationException($"Người dùng với id {request.UserId} không tồn tại");
                }

                //var userInfomation = new
                //{
                //    userName = user.UserName,
                //    fullName = user.Name
                //};

                //var userInfoArray = new ArrayList();
                //PropertyInfo[] properties = userInfomation.GetType().GetProperties();
                //foreach (var property in properties)
                //{
                //    var name = property.Name;
                //    var value = property.GetValue(userInfomation);
                //    userInfoArray.Add(new { Name = name, Value = value });
                //}

                //var embedData = new
                //{
                //    merchantinfo = new
                //    {
                //        userName = user.UserName,
                //        fullName = user.Name
                //    }
                //};
                var zaloRequest = new CreateZaloPayOrderRequest
                {
                    AppId = int.Parse(appId),
                    AppUser = request.UserId.ToString(),
                    //AppUser = System.Text.Json.JsonSerializer.Serialize(userInfomation),
                    AppTransId = appTransId,
                    AppTime = DateTimeOffset.Now.ToUnixTimeMilliseconds(),
                    Amount = request.Amount,
                    Description = request.Description,
                    CallbackUrl = callbackUrl,
                    //Item = JsonConvert.SerializeObject(userInfoArray),
                    Item = "[]",
                    EmbedData = "{}",
                    ExpiredDurationSeconds = 900,
                    BankCode = ""
                };
                zaloRequest.Mac = CalculateMac(zaloRequest, key1);

                var zaloResponse = await _payClient.CreateOrderAsync(zaloRequest);

                if (zaloResponse.ReturnCode == 1 || zaloResponse.ReturnCode == 0)
                {
                    int now = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                    var userPlan = new UserPlan
                    {
                        UserPlanId = Guid.NewGuid().ToString(),
                        IsActive = false,
                        CreatedAt = now,
                        PlanId = "PREMIUM",
                        UpdatedAt = now,
                        //UserId = Guid.Parse(zaloRequest.AppUser),
                        UserId = Guid.Parse(request.UserId),
                        StartDate = now,
                        EndDate = (int)DateTimeOffset.UtcNow.AddMonths(1).ToUnixTimeSeconds(),
                    };
                    await _userPlanService.AddPlan(userPlan);

                    var payment = new Payment
                    {
                        PaymentId = appTransId,
                        UserPlanId = userPlan.UserPlanId,
                        Amount = request.Amount,
                        CreatedAt = now,
                        Currency = "VND",
                        PaymentDate = now,
                        Status = PaymentStatus.Pending,
                    };

                    await _paymentRepository.CreatePaymentAsync(payment);
                    return PaymentResult<CreateZaloPayOrderResponse>.Success(zaloResponse, "Đơn hàng tạo thành công");
                }
                else if (zaloResponse.ReturnCode == -49)
                {
                    return PaymentResult<CreateZaloPayOrderResponse>.Fail("Chữ kí MAC không hợp lệ – kiểm tra Key1.");
                }
                else if (zaloResponse.ReturnCode == -1 || zaloResponse.ReturnCode == -2)
                {
                    return PaymentResult<CreateZaloPayOrderResponse>.Fail("Hệ thống bận, thử lại sau.");
                }
                else
                {
                    return PaymentResult<CreateZaloPayOrderResponse>.Fail($"ZaloPay lỗi {zaloResponse.ReturnCode}: {zaloResponse.ReturnMessage}");
                }
            }
            catch (FormatException ex)
            {
                _logger.LogError($"Lỗi khi tạo zalo order {ex.Message}");
                return PaymentResult<CreateZaloPayOrderResponse>.Fail($"Lỗi format: {ex.Message}"); ;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo zalo order");
                return PaymentResult<CreateZaloPayOrderResponse>.Fail(ex.Message + $"Hi {appId} + {key1} + {callbackUrl}");
            }
        }

        public async Task<string> HandleCallbackAsync(ZaloPayCallbackRequest callbackRequest)
        {
            try
            {
                var key2 = _configuration["ZaloPay:Key2"];
                if (string.IsNullOrEmpty(key2))
                {
                    return JsonConvert.SerializeObject(new
                    {
                        return_code = 0,
                        return_message = "Missing Key2"
                    });
                }

                // 1. Verify MAC using raw data
                var macCheck = CalculateCallbackMac(callbackRequest.Data, key2);
                if (macCheck != callbackRequest.Mac)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        return_code = -1,
                        return_message = "Invalid MAC"
                    });
                }

                // 2. Parse callback data
                var callbackData = JsonConvert.DeserializeObject<ZaloPayCallbackData>(callbackRequest.Data);
                if (callbackData == null)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        return_code = 0,
                        return_message = "Invalid data"
                    });
                }

                // 3. Update payment status -> Success
                await _paymentRepository.UpdatePaymentStatusAsync(callbackData.AppTransId, PaymentStatus.Success);

                // 4. Activate user plan
                var payment = await _paymentRepository.GetByAppTransIdAsync(callbackData.AppTransId);
                if (payment != null)
                {
                    var userPlan = await _userPlanService.GetByIdAsync(payment.UserPlanId);
                    if (userPlan != null && !userPlan.IsActive)
                    {
                        int now = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                        userPlan.IsActive = true;
                        userPlan.StartDate = now;
                        userPlan.EndDate = (int)DateTimeOffset.UtcNow.AddMonths(1).ToUnixTimeSeconds();
                        userPlan.UpdatedAt = now;

                        await _userPlanService.UpdateUserPlan(userPlan);
                    }
                }

                return JsonConvert.SerializeObject(new { return_code = 1, return_message = "success" });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
                {
                    return_code = 0,
                    return_message = ex.Message
                });
            }
        }

        public async Task<int> CheckStatus(string appTransId)
        {
            var payment = await _paymentRepository.GetByAppTransIdAsync(appTransId);

            if (payment != null)
            {
                if (payment.Status == PaymentStatus.Success) return 1;
            }

            return 0;
        }


        private string CalculateMac(CreateZaloPayOrderRequest request, string key1)
        {
            var rawData = $"{request.AppId}|{request.AppTransId}|{request.AppUser}|{request.Amount}|{request.AppTime}|{request.EmbedData}|{request.Item}";

            using (var hmac = new System.Security.Cryptography.HMACSHA256(System.Text.Encoding.UTF8.GetBytes(key1)))
            {
                byte[] hashBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(rawData));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
        private string CalculateCallbackMac(string data, string key2)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key2));
            byte[] hashValue = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
        }


        // dùng cho callback
        //private string CalculateMac(string message, string key2)
        //{
        //    using (var hmac = new System.Security.Cryptography.HMACSHA256(System.Text.Encoding.UTF8.GetBytes(key2)))
        //    {
        //        byte[] hashBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(message));
        //        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        //    }
        //}
    }
}
