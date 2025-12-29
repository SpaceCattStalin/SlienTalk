namespace Application.Commons.DTOs
{
    public class AssignPlanRequestDto
    {
        public string PlanId { get; set; } = null!;
    }
    public class AssignPlanResponseDto
    {
        public string UserPlanId { get; set; } = null!;
        public string PlanId { get; set; } = null!;
        public string PlanName { get; set; } = null!;
        public bool IsActive { get; set; }
        public int StartDate { get; set; }
        public int? EndDate { get; set; }
    }
}
