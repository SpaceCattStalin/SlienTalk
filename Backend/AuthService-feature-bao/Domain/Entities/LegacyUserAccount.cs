namespace Domain.Entities
{
    // Map tới bảng [User] (tránh trùng với Domain.Entities.User của Identity)
    public class LegacyUserAccount
    {
        public string UserId { get; set; } = default!; // VARCHAR(50)
        public string LastName { get; set; } = default!; // VARCHAR(50) NOT NULL
        public string FirstName { get; set; } = default!; // VARCHAR(50) NOT NULL
        public string PasswordHash { get; set; } = default!; // VARCHAR(50) NOT NULL
        public string Email { get; set; } = default!; // VARCHAR(50) NOT NULL
        public DateTime CreateDate { get; set; } // DATE NOT NULL
        public string? PhoneNumber { get; set; } // VARCHAR(10) NULL
    }
}


