namespace Application.Commons.DTOs
{
    public class MoveSignWordRequest
    {
        public string SignWordId { get; set; } = null!;
        public string FromCollectionId { get; set; } = null!;
        public string ToCollectionId { get; set; } = null!;
    }

}
