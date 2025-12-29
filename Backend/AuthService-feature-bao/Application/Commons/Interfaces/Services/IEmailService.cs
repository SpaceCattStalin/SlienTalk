namespace Application.Commons.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendResetPasswordEmailAsync(string email, string resetToken);
        Task<bool> HasValidMxRecordAsync(string email);
    }
}
