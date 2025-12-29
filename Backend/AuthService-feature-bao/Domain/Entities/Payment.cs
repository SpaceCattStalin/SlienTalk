using Domain.Enums;

namespace Domain.Entities
{
    public class Payment
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

        // Optional fields
        public string? FailureReason { get; set; }
        public bool? IsRefunded { get; set; }
        public int? RefundedAt { get; set; }
        public decimal? RefundedAmount { get; set; }
        public string? RefundedStatus { get; set; }

        public UserPlan UserPlan { get; set; } = null!;
    }
}
