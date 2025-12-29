using System.Text.Json.Serialization;

namespace Application.Commons.DTOs
{
    public class CreateZaloPayOrderRequest
    {
        [JsonPropertyName("app_id")]
        public int AppId { get; set; }

        [JsonPropertyName("app_user")]
        public string AppUser { get; set; }

        [JsonPropertyName("app_trans_id")]
        public string AppTransId { get; set; }

        [JsonPropertyName("app_time")]
        public long AppTime { get; set; }

        [JsonPropertyName("amount")]
        public int Amount { get; set; }

        [JsonPropertyName("item")]
        public string Item { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("callback_url")]
        public string CallbackUrl { get; set; }

        [JsonPropertyName("embed_data")]
        public string EmbedData { get; set; }

        // mac sẽ được set sau cùng
        [JsonPropertyName("mac")]
        public string Mac { get; set; }

        [JsonPropertyName("expire_duration_seconds")]
        public long ExpiredDurationSeconds { get; set; }
        // optional
        [JsonPropertyName("bank_code")]
        public string BankCode { get; set; }
    }
}
