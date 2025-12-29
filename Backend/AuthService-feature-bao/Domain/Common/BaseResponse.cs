using Domain.Constants;

namespace Domain.Common
{
    public class BaseResponse<T>
    {
        public T? Data { get; set; }
        public string? Message { get; set; }
        public StatusCodeHelper StatusCode { get; set; }

        private BaseResponse(T? data, string? message, StatusCodeHelper statusCode)
        {
            Data = data;
            Message = message;
            StatusCode = statusCode;
        }

        public static BaseResponse<T> OkResponse(T? data, string mess, StatusCodeHelper statusCode)
        {
            return new BaseResponse<T>(data, mess, StatusCodeHelper.OK);
        }
        public static BaseResponse<T> ErrorResponse(string? message, StatusCodeHelper statusCode)
        {
            return new BaseResponse<T>(default, message, statusCode);
        }
    }
}
