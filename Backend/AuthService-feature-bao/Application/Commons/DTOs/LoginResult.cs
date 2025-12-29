namespace Application.Commons.DTOs
{
    public abstract class LoginResult
    {
        public bool IsSuccess { get; set; }
    }

    public class LoginSuccess : LoginResult
    {
        public string AccessToken { get; }

        public LoginSuccess(string accessToken)
        {
            IsSuccess = true;
            AccessToken = accessToken;
        }
    }

    public class LoginFailure : LoginResult
    {
        public string ErrorMessage { get; }
        public LoginFailure(string errorMessage)
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
        }
    }
}
