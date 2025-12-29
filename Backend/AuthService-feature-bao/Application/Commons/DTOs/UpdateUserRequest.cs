using System.ComponentModel.DataAnnotations;

namespace Application.Commons.DTOs
{
    public class UpdateUserRequest
    {
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string? Name { get; set; }

        //[EmailAddress(ErrorMessage = "Invalid email format")]
        //[StringLength(256, ErrorMessage = "Email cannot exceed 256 characters")]
        //public string? Email { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string? PhoneNumber { get; set; }
    }
}
