using Domain.Entities;
using Domain.Enums;

namespace Application.Commons.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<int> CreatePaymentAsync(Payment payment);

        Task<int> UpdatePaymentStatusAsync(string paymentId, PaymentStatus status, string? reason = null);

        Task<Payment> GetByAppTransIdAsync(string appTransId);
    }
}
