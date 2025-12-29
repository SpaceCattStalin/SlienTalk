using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class SignWord
    {
        public string SignWordId { get; set; } = default!;
        public string? Word { get; set; }
        public string? Category { get; set; }
        public string? Definition { get; set; }
        public string? WordType { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public string? SignWordUri { get; set; }
        public string? ExampleSentence { get; set; }
        public string? ExampleSentenceVideoUri { get; set; }
        [JsonIgnore]
        public ICollection<SignWordCollectionSignWord> SignWordCollections { get; set; } = new List<SignWordCollectionSignWord>();
    }
}


