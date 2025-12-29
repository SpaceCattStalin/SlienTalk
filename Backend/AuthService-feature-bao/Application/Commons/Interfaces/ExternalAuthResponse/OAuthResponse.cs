namespace Application.Commons.Interfaces.ExternalAuthResponse
{
    public abstract class OAuthResponse
    {
        public string AccessToken { get; set; } = default!;
        public string RefreshToken { get; set; } = default!;
    }
}
