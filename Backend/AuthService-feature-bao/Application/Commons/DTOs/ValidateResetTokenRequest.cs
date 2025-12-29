namespace Application.Commons.DTOs
{
    public class ValidateResetTokenRequest
    {
        public string ResetToken { get; set; } = default!;
        public string Email { get; set; } = default!;
    }
}
