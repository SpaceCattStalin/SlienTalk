using Application.Commons.DTOs;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;

namespace Infrastructure.External
{
    public class ZaloPayClient : IZaloPayClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _endpoint;
        public ZaloPayClient(HttpClient httpClient, IConfiguration configuration)
        {
            _endpoint = configuration["ZaloPay:CreateOrderUrl"];
            _httpClient = httpClient;
        }
        public async Task<CreateZaloPayOrderResponse> CreateOrderAsync(CreateZaloPayOrderRequest request)
        {
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_endpoint, content);
            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<CreateZaloPayOrderResponse>(json);
        }
    }
}
