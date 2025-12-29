using Domain.Entities;
using Domain.Enums;

namespace API.Entities
{
    public class AdminPaymentRespond
    {
        public string PaymentId { get; set; } = null!;
        public string UserPlanId { get; set; } = null!;

        public decimal Amount { get; set; }
        public string Currency { get; set; } = "VND";
        public int PaymentDate { get; set; } // Unix timestamp

        public PaymentStatus Status { get; set; } = 0; // Pending, Paid, Failed, Refunded
        public string PaymentMethod { get; set; } = "ZaloPay";

        public int CreatedAt { get; set; }
        public int UpdateAt { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
        public string Name { get; set; }
    }
}
