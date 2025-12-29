namespace Domain.Entities
{
    public class SignWordCollectionSignWord
    {
        public string CollectionId { get; set; } = default!;
        public string SignWordId { get; set; } = default!;
        public DateTime? AddedAt { get; set; }

        public SignWordCollection Collection { get; set; } = default!;
        public SignWord SignWord { get; set; } = default!;
    }
}


