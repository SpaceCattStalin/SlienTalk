namespace API.DTOs
{
    public class ImageUploadDTO
    {
        public IFormFile File { get; set; }
        public string? SignWordId { get; set; }
    }
}
