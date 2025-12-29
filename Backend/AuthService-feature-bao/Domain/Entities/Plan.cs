namespace Domain.Entities
{
    public class Plan
    {
        public string PlanId { get; set; } = null!;

        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public string Currency { get; set; } = null!;

        public bool IsActive { get; set; }
        public short DurationDays { get; set; }

        public int CreatedAt { get; set; }
        public int UpdatedAt { get; set; }

        public ICollection<UserPlan> UserPlans { get; set; }
    }

}
