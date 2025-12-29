namespace Application.Commons.DTOs
{
    public class ZaloUserInfo
    {
        public string Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public ZaloPicture? Picture { get; set; }
        public class ZaloPicture
        {
            public ZaloPictureData Data { get; set; } = default!;
        }

        public class ZaloPictureData
        {
            public string Url { get; set; } = default!;
        }
    }
}
