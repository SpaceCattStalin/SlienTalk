using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace Application.Commons.DTOs
{
    public class ZaloPayCallbackRequest
    {
        [JsonProperty("data")]
        public string Data { get; set; }

        [JsonProperty("mac")]
        public string Mac { get; set; }

        [JsonProperty("type")]
        public int Type { get; set; }
    }

    public class ZaloPayCallbackData
    {
        [JsonProperty("app_id")]
        public long AppId { get; set; }

        [JsonProperty("app_trans_id")]
        public string AppTransId { get; set; }

        [JsonProperty("app_time")]
        public long AppTime { get; set; }

        [JsonProperty("app_user")]
        public string AppUser { get; set; }

        [JsonProperty("amount")]
        public long Amount { get; set; }

        [JsonProperty("zp_trans_id")]
        public long ZpTransId { get; set; }

        [JsonProperty("server_time")]
        public long ServerTime { get; set; }

        [JsonProperty("channel")]
        public int Channel { get; set; }

        [JsonProperty("merchant_user_id")]
        public string MerchantUserId { get; set; }

        [JsonProperty("zp_user_id")]
        public string ZpUserId { get; set; }
    }

}
