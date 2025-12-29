namespace Application.Commons.DTOs
{
    public class PaymentResult<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public static PaymentResult<T> Success(T data, string message = "Thành công") =>
            new PaymentResult<T> { IsSuccess = true, Message = message, Data = data };

        public static PaymentResult<T> Fail(string message) =>
            new PaymentResult<T> { IsSuccess = false, Message = message };
    }
}
