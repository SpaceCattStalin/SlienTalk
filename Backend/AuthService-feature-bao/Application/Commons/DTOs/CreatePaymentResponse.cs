using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commons.DTOs
{
    public class CreatePaymentResponse
    {
        //public CreatePaymentResponse(string orderUrl, string zpTransToken, string message)
        //{
        //    OrderUrl = orderUrl;
        //    zpTransToken = ZpTransToken;
        //    Message = message;
        //}

        public string OrderUrl { get; set; }
        public string ZpTransToken { get; set; }
        public string Message { get; set; }
    }
}
