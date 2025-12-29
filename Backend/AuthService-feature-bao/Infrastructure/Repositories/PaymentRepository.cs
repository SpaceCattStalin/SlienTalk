using Application.Commons.Interfaces.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreatePaymentAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);

            var res = await _context.SaveChangesAsync();
            return res;
        }

        public async Task<Payment> GetByAppTransIdAsync(string appTransId)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == appTransId);
        }

        public async Task<int> UpdatePaymentStatusAsync(string paymentId, PaymentStatus status, string? reason = null)
        {
            var existingPayment = await _context.Payments.FindAsync(paymentId);
            // var existingPayment = await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == paymentId);
            if (existingPayment == null) throw new InvalidOperationException("Payment với id này không tồn tại!");

            if (existingPayment.Status != Domain.Enums.PaymentStatus.Success
                && existingPayment.Status != Domain.Enums.PaymentStatus.Failed)
            {
                existingPayment.Status = status;
                existingPayment.FailureReason = reason;
                existingPayment.UpdateAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                _context.Payments.Update(existingPayment);
            }
            return await _context.SaveChangesAsync();
        }
    }
}
