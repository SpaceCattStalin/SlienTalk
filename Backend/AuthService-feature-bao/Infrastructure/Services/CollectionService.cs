using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class CollectionService : ICollectionService
    {
        private readonly ApplicationDbContext _db;

        public CollectionService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task CreateDefaultCollectionAsync(string userId)
        {
            // Check if user already has a default collection
            bool exists = _db.SignWordCollections
                .Any(c => c.CreatedBy == userId && c.IsDefault);

            if (!exists)
            {
                var collection = new SignWordCollection
                {
                    CollectionId = Guid.NewGuid().ToString(),
                    Name = "Tất cả từ đã lưu",
                    CreatedBy = userId,
                    IsDefault = true,
                    CreatedAt = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                };

                _db.SignWordCollections.Add(collection);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<RelatedSignWordDto>> GetRelatedWordsAsync(string signWordId)
        {
            // 1. Forward relations (SignWord → RelatedSignWord)
            var relatedWords = await _db.RelatedSignWords
                .Where(rsw => rsw.SignWordId == signWordId)
                .Join<RelatedSignWord, SignWord, string, RelatedSignWordDto>(
                    _db.SignWords,
                    rsw => rsw.RelatedSignWordId,
                    sw => sw.SignWordId,
                    (rsw, sw) => new RelatedSignWordDto
                    {
                        RelatedSignWordId = sw.SignWordId,
                        Word = sw.Word ?? string.Empty,
                        Notes = rsw.Notes
                    }
                )
                .ToListAsync();

            // 2. Reverse relations (RelatedSignWord → SignWord)
            var reverseRelated = await _db.RelatedSignWords
                .Where(rsw => rsw.RelatedSignWordId == signWordId)
                .Join<RelatedSignWord, SignWord, string, RelatedSignWordDto>(
                    _db.SignWords,
                    rsw => rsw.SignWordId,
                    sw => sw.SignWordId,
                    (rsw, sw) => new RelatedSignWordDto
                    {
                        RelatedSignWordId = sw.SignWordId,
                        Word = sw.Word ?? string.Empty,
                        Notes = rsw.Notes
                    }
                )
                .ToListAsync();

            var all = relatedWords
                .Concat(reverseRelated)
                .GroupBy(r => r.RelatedSignWordId)
                .Select(g => g.First())
                .ToList();

            return all;
        }

    }
}
