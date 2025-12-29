using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class AdminSignWordsFilterRequest
    {
        public string? Keyword { get; set; }
        public string? Category { get; set; }
        public string? WordType { get; set; }
        public bool? IsActive { get; set; }
        public string? SortBy { get; set; }

        // Paging
        [DefaultValue(1)]
        public int CurrentPage { get; set; } = 1;
        [DefaultValue(10)]
        public int PageSize { get; set; } = 10;

    }

    public class SignWordUpdateRequest
    {
        [Required(ErrorMessage = "Tên từ không được để trống")]
        public string Word { get; set; }

        [Required(ErrorMessage = "Danh mục không được để trống")]
        public string Category { get; set; }
        public string? Definition { get; set; }

        [Required(ErrorMessage = "Loại từ không được để trống")]
        public string WordType { get; set; }
        public bool? IsActive { get; set; }
        public string? ExampleSentence { get; set; }

    }
    public class CreateSignWordDto
    {
        [Required(ErrorMessage = "Tên từ không được để trống")]
        public string Word { get; set; } = default!;

        [Required(ErrorMessage = "Danh mục không được để trống")]
        [RegularExpression("Câu hỏi|Chữ cái|Gia đình|Trường học",
            ErrorMessage = "Category không hợp lệ (Câu hỏi|Chữ cái|Gia đình|Trường học)")]
        public string Category { get; set; } = default!;

        [Required(ErrorMessage = "Định nghĩa không được để trống")]
        public string Definition { get; set; } = default!;

        [Required(ErrorMessage = "Loại từ không được để trống")]
        [RegularExpression("Chữ cái|Cụm từ nghi vấn|Danh từ|Động từ",
            ErrorMessage = "WordType không hợp lệ (Chữ cái|Cụm từ nghi vấn|Danh từ|Động từ)")]
        public string WordType { get; set; } = default!;

        //[Required(ErrorMessage = "Video ký hiệu không được để trống")]
        //public string SignWordUri { get; set; } = default!;

        //[Required(ErrorMessage = "Ví dụ câu không được để trống")]
        public string ExampleSentence { get; set; } = default!;

        //[Required(ErrorMessage = "Video ví dụ câu không được để trống")]
        //public string ExampleSentenceVideoUri { get; set; } = default!;
    }

}
