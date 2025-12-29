using System.Text.Json.Serialization;

namespace Application.Commons.DTOs
{
    public class CreateZaloPayOrderResponse
    {
        [JsonPropertyName("return_code")]
        public int ReturnCode { get; set; }

        [JsonPropertyName("return_message")]
        public string ReturnMessage { get; set; }

        //[JsonPropertyName("sub_return_code")]
        //public string SubReturnCode { get; set; }

        //[JsonPropertyName("sub_return_message")]
        //public string SubReturnMessage { get; set; }


        [JsonPropertyName("order_url")]
        public string OrderUrl { get; set; }

        [JsonPropertyName("order_token")]
        public string OrderToken { get; set; }

        [JsonPropertyName("zp_trans_token")]
        public string ZpTransToken { get; set; }

        [JsonPropertyName("qr_code")]
        public string QrCode { get; set; }

    }
}
