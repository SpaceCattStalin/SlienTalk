using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class SignWordCollection
    {
        public string CollectionId { get; set; } = default!; // VARCHAR(50)
        public string? CreatedBy { get; set; }
        public string? Name { get; set; }
        public int? CreatedAt { get; set; }
        public int? UpdatedAt { get; set; }
        public bool IsDefault { get; set; }
        [JsonIgnore]
        public ICollection<SignWordCollectionSignWord> SignWords { get; set; } = new List<SignWordCollectionSignWord>();
    }
}


