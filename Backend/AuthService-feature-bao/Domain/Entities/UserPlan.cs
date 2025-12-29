namespace Domain.Entities
{
    public class UserPlan
    {
        public string UserPlanId { get; set; } = null!;

        public string PlanId { get; set; } = null!;
        public Guid UserId { get; set; }

        public int StartDate { get; set; }
        public int EndDate { get; set; }

        public bool IsActive { get; set; } = false;

        public int CanceledAt { get; set; }
        public int CreatedAt { get; set; }
        public int UpdatedAt { get; set; }

        public Plan Plan { get; set; }
        public User User { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

}
