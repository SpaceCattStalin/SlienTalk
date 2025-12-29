using Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Events
{
    public class UserRegisteredEvent : BaseEvent
    {
        public Guid UserId { get; }
        public string Email { get; } = default!;
        public DateTime RegisteredAt { get; } = default!;

        public UserRegisteredEvent(Guid userId, string email, DateTime registeredAt)
        {
            UserId = userId;
            Email = email;
            RegisteredAt = registeredAt;
        }
    }
}
