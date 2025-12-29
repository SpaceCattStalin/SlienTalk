using Application.Commons.DTOs;

namespace Application.Commons.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<PaymentResult<CreateZaloPayOrderResponse>> CreateOrderAsync(CreatePaymentRequest request);
        Task<string> HandleCallbackAsync(ZaloPayCallbackRequest callbackRequest);
        Task<int> CheckStatus(string appTransId);

        //Task<string> HandleCallbackAsync(ZaloPayCallbackRequest callbackRequest);
        //Task<string> HandleCallbackAsync(string data);
    }
}
