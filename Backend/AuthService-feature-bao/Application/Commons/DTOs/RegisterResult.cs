namespace Application.Commons.DTOs
{
    public abstract class RegisterResult
    {
        public bool IsSuccess { get; protected set; }
    }

    public class RegisterSuccess : RegisterResult
    {
        public string Message { get; }
        public string UserId { get; protected set; }

        public RegisterSuccess(string message, string userId)
        {
            IsSuccess = true;
            Message = message;
            UserId = userId;
        }
    }

    public class RegisterFailure : RegisterResult
    {
        public string ErrorMessage { get; }

        public RegisterFailure(string errorMessage)
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
        }
    }
}
