using Domain.Shared;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; } = default!;
        public Guid UserId { get; set; } = default!;
        public string HashedToken { get; set; } = default!;
        public DateTime ExpiresAt { get; set; }
        public User User { get; set; } = default!;

        //[NotMapped]
        //private readonly List<BaseEvent> _domainEvents = [];

        //public IReadOnlyCollection<BaseEvent> DomainEvents
        //{
        //    get { return _domainEvents.AsReadOnly(); }
        //}

        //public void AddDomainEvent(BaseEvent domainEvent)
        //{
        //    _domainEvents.Add(domainEvent);
        //}

        //public void RemoveDomainEvent(BaseEvent domainEvent)
        //{
        //    _domainEvents.Remove(domainEvent);
        //}
        //public void ClearDomainEvents()
        //{
        //    _domainEvents.Clear();
        //}
    }
}
