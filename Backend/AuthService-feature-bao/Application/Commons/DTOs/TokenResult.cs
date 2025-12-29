namespace Application.Commons.DTOs
{
    public class TokenResult
    {
        public string AccessToken { get; set; } = default!;
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = default!;
    }
}
