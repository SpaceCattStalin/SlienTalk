using Application.Commons.Interfaces.Services;
using DnsClient;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Newtonsoft.Json.Linq;

namespace Infrastructure.Services
{
    public sealed class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<bool> HasValidMxRecordAsync(string email)
        {
            var domain = email.Split('@').LastOrDefault();
            var lookup = new LookupClient();

            var result = await lookup.QueryAsync(domain, QueryType.MX);
            return result.Answers.MxRecords().Any();
        }

        public async Task SendResetPasswordEmailAsync(string email, string resetToken)
        {
            var redirectUrl = _config["Email:RedirectUrl"];
            var confirmationLink = $"{redirectUrl}?token={resetToken}";

            var html = $@"
                <html>
                <body style=""font-family: Arial, sans-serif; line-height: 1.6;"">
                    <h2>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Xin chào,</p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn với địa chỉ email <strong>{email}</strong>.</p>
                    <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                    <p>
                        <a href=""{confirmationLink}""
                           style=""background-color: #007BFF; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px;"">
                            Đặt lại mật khẩu
                        </a>
                    </p>
                    <p>Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.</p>
                    <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
                </body>
                </html>
            ";

            await BuildEmailAsync(email, "Đặt lại mật khẩu của bạn", html);
        }

        private async Task BuildEmailAsync(string to, string subject, string htmlContent)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["Email:From"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = htmlContent
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["Email:SmtpHost"], int.Parse(_config["Email:SmtpPort"]));
            await smtp.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
