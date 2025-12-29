using System.ComponentModel.DataAnnotations.Schema;


namespace Domain.Shared
{
    public abstract class BaseEntity
    {
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
    }
}
