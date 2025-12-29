using Domain.Events;
using Domain.Shared;
using Domain.ValueObjects;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        [NotMapped]
        public EmailAddress EmailAddress
        {
            get => EmailAddress.Create(base.Email ?? "").Value;
            set => base.Email = value.Value;
        }
        [NotMapped]
        public Password Password
        {
            get => Password.Create(base.PasswordHash ?? "").Value;
            set => base.PasswordHash = value.Value;
        }
        public DateTime UpdatedAt { get; private set; } = default!;
        public string? Name { get; set; }
        public new string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }


        public List<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();


        public List<UserPlan> UserPlans { get; set; } = new List<UserPlan>();


        public User()
        {

        }

        private User(EmailAddress email, Password password)
        {
            Id = Guid.NewGuid();
            Email = email.Value;
            Password = password;

            AddDomainEvent(new UserRegisteredEvent(Id, email.Value, registeredAt: new DateTime()));
        }
        private User(EmailAddress email)
        {
            Id = Guid.NewGuid();
            Email = email.Value;

            AddDomainEvent(new UserRegisteredEvent(Id, email.Value, registeredAt: new DateTime()));
        }

        public static Result<User> Create(string email, string password)
        {
            var emailResult = EmailAddress.Create(email);
            if (emailResult.IsFailed)
                return Result.Fail<User>(string.Join(". ", emailResult.Errors.Select(e => e.Message)));

            var passwordResult = Password.Create(password);
            if (passwordResult.IsFailed)
                return Result.Fail<User>(string.Join(". ", passwordResult.Errors.Select(e => e.Message)));

            return Result.Ok(new User(emailResult.Value, passwordResult.Value));
        }
        public static Result<User> Create(string email)
        {
            var emailResult = EmailAddress.Create(email);
            if (emailResult.IsFailed)
                return Result.Fail<User>(string.Join(". ", emailResult.Errors.Select(e => e.Message)));

            return Result.Ok(new User(emailResult.Value));
        }

        public static Result<User> Create(Guid id)
        {
            var user = new User
            {
                Id = id
            };

            return Result.Ok(user);
        }

        [NotMapped]
        private readonly List<BaseEvent> _domainEvents = [];

        public IReadOnlyCollection<BaseEvent> DomainEvents
        {
            get { return _domainEvents.AsReadOnly(); }
        }

        public void AddDomainEvent(BaseEvent domainEvent)
        {
            _domainEvents.Add(domainEvent);
        }

        public void RemoveDomainEvent(BaseEvent domainEvent)
        {
            _domainEvents.Remove(domainEvent);
        }
        public void ClearDomainEvents()
        {
            _domainEvents.Clear();
        }
        public Result<bool> UpdateUserInfo(string? name, string? email, string? phoneNumber)
        {
            try
            {
                if (!string.IsNullOrEmpty(name))
                {
                    Name = name;
                }

                if (!string.IsNullOrEmpty(email))
                {
                    var emailResult = EmailAddress.Create(email);
                    if (emailResult.IsFailed)
                        return Result.Fail<bool>(string.Join(". ", emailResult.Errors.Select(e => e.Message)));

                    Email = emailResult.Value.Value;
                }

                if (!string.IsNullOrEmpty(phoneNumber))
                {
                    PhoneNumber = phoneNumber;
                }

                UpdatedAt = DateTime.UtcNow;
                return Result.Ok(true);
            }
            catch (Exception ex)
            {
                return Result.Fail<bool>($"Error updating user info: {ex.Message}");
            }
        }
    }
}
