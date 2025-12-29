using Application.Commons.DTOs;

namespace Infrastructure.External
{
    public interface IZaloPayClient
    {
        Task<CreateZaloPayOrderResponse> CreateOrderAsync(CreateZaloPayOrderRequest request);
    }
}
