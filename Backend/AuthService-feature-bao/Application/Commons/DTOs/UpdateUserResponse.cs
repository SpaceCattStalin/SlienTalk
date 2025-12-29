namespace Application.Commons.DTOs
{
    public class UpdateUserResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorMessage { get; set; }
        public UserInfo? UserInfo { get; set; }
    }

    public class UserInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        public string ImgUrl { get; set; }
    }
}
