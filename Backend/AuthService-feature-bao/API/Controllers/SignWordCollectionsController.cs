using Application.Commons.DTOs;
using Application.Commons.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignWordCollectionsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ICollectionService _collectionService;
        public SignWordCollectionsController(ApplicationDbContext db, ICollectionService collectionService)
        {
            _db = db;
            _collectionService = collectionService;
        }

        // GET: api/signwordcollections?createdBy=USER_ID
        //[HttpGet]
        //public async Task<IActionResult> GetByCreatedBy([FromQuery] string? createdBy = null)
        //{
        //    var owner = createdBy;

        //    if (string.IsNullOrWhiteSpace(owner))
        //    {
        //        // Fallback: lấy từ JWT (sub)
        //        owner = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        //    }

        //    if (string.IsNullOrWhiteSpace(owner))
        //    {
        //        return BadRequest(new { IsSuccess = false, ErrorMessage = "Missing createdBy or bearer token." });
        //    }

        //    var collections = await _db.SignWordCollections
        //        .AsNoTracking()
        //        .Where(c => c.CreatedBy == owner)
        //        .Select(c => new
        //        {
        //            c.CollectionId,
        //            c.Name,
        //            c.CreatedBy,
        //            c.IsDefault,
        //            c.CreatedAt,
        //            c.UpdatedAt,
        //            SignWords = c.SignWords
        //                .Select(sw => new
        //                {
        //                    sw.SignWordId,
        //                    Word = sw.SignWord.Word,
        //                    sw.SignWord.Category,
        //                    sw.SignWord.WordType,
        //                    sw.SignWord.IsActive,
        //                    sw.SignWord.SignWordUri
        //                })
        //        })
        //        .ToListAsync();

        //    return Ok(new { IsSuccess = true, Data = collections });
        //}

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var owner = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(owner))
            {
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "Missing user id claim (sub)." });
            }

            var collections = await _db.SignWordCollections
                .AsNoTracking()
                .Where(c => c.CreatedBy == owner)
                .Select(c => new
                {
                    c.CollectionId,
                    c.Name,
                    c.CreatedBy,
                    c.IsDefault,
                    c.CreatedAt,
                    c.UpdatedAt,
                    SignWords = c.SignWords
                        .Select(sw => new
                        {
                            sw.SignWordId,
                            Word = sw.SignWord.Word,
                            sw.SignWord.Category,
                            sw.SignWord.WordType,
                            sw.SignWord.IsActive,
                            sw.SignWord.SignWordUri
                        })
                })
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return Ok(new { IsSuccess = true, Data = collections });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("by_category")]
        public async Task<IActionResult> GetByCategory([FromQuery] string? category = null)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            var query = _db.SignWords.AsNoTracking().Where(w => w.IsActive);

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(w => w.Category == category);
            }

            List<string> userWordIds = new();
            List<WordCollectionMapping> wordToCollectionMap = new();

            if (!string.IsNullOrWhiteSpace(userId))
            {
                var collectionIds = await _db.SignWordCollections
                    .Where(c => c.CreatedBy == userId)
                    .Select(c => c.CollectionId)
                    .ToListAsync();

                userWordIds = await _db.SignWordCollectionSignWords
                    .Where(link => collectionIds.Contains(link.CollectionId))
                    .Select(link => link.SignWordId)
                    .Distinct()
                    .ToListAsync();

                wordToCollectionMap = await _db.SignWordCollectionSignWords
                    .Where(link => collectionIds.Contains(link.CollectionId))
                    .Select(link => new WordCollectionMapping { CollectionId = link.CollectionId, SignWordId = link.SignWordId })
                    .ToListAsync();
            }


            var words = await query
                .Select(w => new
                {
                    w.SignWordId,
                    w.Word,
                    w.Category,
                    w.Definition,
                    w.WordType,
                    w.SignWordUri,
                    w.ExampleSentence,
                    w.ExampleSentenceVideoUri,
                    w.CreatedAt,
                    w.UpdatedAt,
                    IsInUserCollection = userWordIds.Contains(w.SignWordId),
                })
                .ToListAsync();

            var enrichedWords = words
                .Select(w => new
                {
                    w.SignWordId,
                    w.Word,
                    w.Category,
                    w.Definition,
                    w.WordType,
                    w.SignWordUri,
                    w.ExampleSentence,
                    w.ExampleSentenceVideoUri,
                    w.CreatedAt,
                    w.UpdatedAt,
                    w.IsInUserCollection,
                    BelongToCollections = wordToCollectionMap
                                            .Where(map => map.SignWordId == w.SignWordId)
                                            .Select(map => map.CollectionId)
                                            .ToList()
                })
                .ToList();

            if (words.Count == 0)
            {
                return NotFound(new
                {
                    IsSuccess = false,
                    ErrorMessage = category == null
                        ? "No words found."
                        : $"No words found for category '{category}'."
                });
            }

            return Ok(new
            {
                IsSuccess = true,
                Count = words.Count,
                //Data = words
                Data = enrichedWords
            });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new
                {
                    IsSuccess = false,
                    ErrorMessage = "Id parameter is required."
                });
            }

            var word = await _db.SignWords
                .AsNoTracking()
                .Where(w => w.SignWordId == id && w.IsActive)
                .Select(w => new
                {
                    w.SignWordId,
                    w.Word,
                    w.Category,
                    w.Definition,
                    w.WordType,
                    w.SignWordUri,
                    w.ExampleSentence,
                    w.ExampleSentenceVideoUri,
                    w.CreatedAt,
                    w.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (word == null)
            {
                return NotFound(new
                {
                    IsSuccess = false,
                    ErrorMessage = $"No word found with Id '{id}'."
                });
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            bool isInUserCollection = false;

            if (!string.IsNullOrWhiteSpace(userId))
            {
                var userCollectionIds = await _db.SignWordCollections
                    .Where(c => c.CreatedBy == userId)
                    .Select(c => c.CollectionId)
                    .ToListAsync();

                isInUserCollection = await _db.SignWordCollectionSignWords
                    .AnyAsync(link => link.SignWordId == id && userCollectionIds.Contains(link.CollectionId));
            }

            return Ok(new
            {
                IsSuccess = true,
                Data = new
                {
                    word.SignWordId,
                    word.Word,
                    word.Category,
                    word.Definition,
                    word.WordType,
                    word.SignWordUri,
                    word.ExampleSentence,
                    word.ExampleSentenceVideoUri,
                    word.CreatedAt,
                    word.UpdatedAt,
                    IsInUserCollection = isInUserCollection
                    //BelongToCollection
                }
            });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("get_by_collection")]
        public async Task<IActionResult> GetWordsInCollection([FromQuery] string collectionId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            var userCollection = await _db.SignWordCollections.FindAsync(collectionId);

            if (userCollection == null)
            {
                return BadRequest(new { Message = "Không tồn tại bộ sưu tập này!" });
            }

            var wordIds = await _db.SignWordCollectionSignWords
                .Where(link => link.CollectionId == collectionId)
                .Select(link => link.SignWordId)
                .ToListAsync();

            var words = await _db.SignWords
                .Where(w => wordIds.Contains(w.SignWordId))
                .ToListAsync();


            return Ok(new
            {
                IsSuccess = true,
                Data = new
                {
                    CollectionName = userCollection.Name,
                    Words = words
                }

            });
        }

        [HttpGet("{signWordId}/related")]
        public async Task<IEnumerable<RelatedSignWordDto>> GetRelatedWordsAsync(Guid signWordId)
        {
            var relatedWords = await _db.RelatedSignWords
                .Where(rsw => rsw.SignWordId == signWordId.ToString())
                .Join(_db.SignWords,
                    rsw => rsw.RelatedSignWordId,
                    sw => sw.SignWordId,
                    (rsw, sw) => new RelatedSignWordDto
                    {
                        RelatedSignWordId = sw.SignWordId,
                        Word = sw.Word!,
                        Notes = rsw.Notes
                    })
                .ToListAsync();

            var reverseRelated = await _db.RelatedSignWords
                .Where(rsw => rsw.RelatedSignWordId == signWordId.ToString())
                .Join(_db.SignWords,
                    rsw => rsw.SignWordId,
                    sw => sw.SignWordId,
                    (rsw, sw) => new RelatedSignWordDto
                    {
                        RelatedSignWordId = sw.SignWordId,
                        Word = sw.Word!,
                        Notes = rsw.Notes
                    })
                .ToListAsync();

            var signWord = await _db.SignWords.FirstOrDefaultAsync(sw => sw.SignWordId == signWordId.ToString());
            var sameCategoryWords = new List<RelatedSignWordDto>();

            if (signWord?.Category != null)
            {
                sameCategoryWords = await _db.SignWords
                    .Where(sw => sw.Category == signWord.Category && sw.SignWordId != signWord.SignWordId)
                    .Select(sw => new RelatedSignWordDto
                    {
                        RelatedSignWordId = sw.SignWordId,
                        Word = sw.Word!,
                        Notes = $"Cùng chủ đề: {signWord.Category}"
                    })
                    .ToListAsync();
            }

            var all = relatedWords
                .Concat(reverseRelated)
                .Concat(sameCategoryWords)
                .GroupBy(r => r.RelatedSignWordId)
                .Select(g => g.First())
                .ToList();

            if (all.Count > 5)
                all = all.OrderBy(_ => Guid.NewGuid()).Take(5).ToList();
            else if (all.Count < 2 && sameCategoryWords.Count > 0)
            {
                var filler = sameCategoryWords
                    .Where(x => !all.Any(y => y.RelatedSignWordId == x.RelatedSignWordId))
                    .OrderBy(_ => Guid.NewGuid())
                    .Take(2 - all.Count)
                    .ToList();

                all.AddRange(filler);
            }

            return all;
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("all_words")]
        public async Task<IActionResult> GetAllSignWords()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "Missing user id claim (sub)." });

            var userCollectionIds = await _db.SignWordCollections
                .Where(c => c.CreatedBy == userId)
                .Select(c => c.CollectionId)
                .ToListAsync();

            var userWordIds = await _db.SignWordCollectionSignWords
                .Where(link => userCollectionIds.Contains(link.CollectionId))
                .Select(link => link.SignWordId)
                .ToListAsync();

            var allWords = await _db.SignWords
                .Where(sw => sw.IsActive)
                .Select(sw => new
                {
                    sw.SignWordId,
                    sw.Word,
                    sw.Category,
                    sw.SignWordUri,
                    IsInUserCollection = userWordIds.Contains(sw.SignWordId)
                })
                .ToListAsync();

            return Ok(new { IsSuccess = true, Data = allWords });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        public async Task<IActionResult> CreateCollection([FromBody] CreateCollectionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "Tên bộ sưu tập là bắt buộc." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "Missing user id claim (sub)." });
            }

            // Check duplicate name for same user
            bool nameExists = await _db.SignWordCollections
                .AnyAsync(c => c.CreatedBy == userId && c.Name == request.Name);

            if (nameExists)
            {
                return Conflict(new
                {
                    IsSuccess = false,
                    ErrorMessage = $"Bộ sưu tập '{request.Name}' đã tồn tại."
                });
            }

            var now = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var collection = new Domain.Entities.SignWordCollection
            {
                CollectionId = Guid.NewGuid().ToString(),
                CreatedBy = userId,
                Name = request.Name,
                IsDefault = request.IsDefault,
                CreatedAt = now,
                UpdatedAt = now
            };

            _db.SignWordCollections.Add(collection);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                IsSuccess = true,
                Message = "Collection created successfully.",
                Data = new
                {
                    collection.CollectionId,
                    collection.Name,
                    collection.CreatedBy,
                    collection.IsDefault,
                    collection.CreatedAt,
                    collection.UpdatedAt
                }
            });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("add_word")]
        public async Task<IActionResult> AddSignWordToCollection([FromBody] AddSignWordToCollectionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CollectionId))
                return BadRequest(new { IsSuccess = false, ErrorMessage = "CollectionId is required." });

            if (string.IsNullOrWhiteSpace(request.SignWordId))
                return BadRequest(new { IsSuccess = false, ErrorMessage = "SignWordId is required." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "Missing user id claim (sub)." });


            var newLink = new SignWordCollectionSignWord
            {
                CollectionId = request.CollectionId,
                SignWordId = request.SignWordId,
                AddedAt = DateTime.UtcNow
            };

            _db.SignWordCollectionSignWords.Add(newLink);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                IsSuccess = true,
                Message = "Từ thêm thành công.",
                Data = new { newLink.SignWordId, newLink.AddedAt }
            });
        }


        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("remove_word_from_all_collections")]
        public async Task<IActionResult> RemoveSignWordFromCollections([FromBody] RemoveSignWordFromCollectionRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            var userCollections = await _db.SignWordCollections.Where(sc => sc.CreatedBy == userId).Select(sc => sc.CollectionId).ToListAsync();

            var links = _db.SignWordCollectionSignWords
                .Where(link => link.SignWordId == request.SignWordId && userCollections.Contains(link.CollectionId));

            _db.SignWordCollectionSignWords.RemoveRange(links);
            await _db.SaveChangesAsync();

            return Ok(new { IsSuccess = true, });
        }
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("move_word")]
        public async Task<IActionResult> MoveSignWord([FromBody] MoveSignWordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.SignWordId) ||
                string.IsNullOrWhiteSpace(request.FromCollectionId) ||
                string.IsNullOrWhiteSpace(request.ToCollectionId))
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "SignWordId, FromCollectionId và ToCollectionId là bắt buộc." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "Missing user id claim (sub)." });

            // Validate collections belong to user
            var userCollectionIds = await _db.SignWordCollections
                .Where(c => c.CreatedBy == userId)
                .Select(c => c.CollectionId)
                .ToListAsync();

            if (!userCollectionIds.Contains(request.FromCollectionId) || !userCollectionIds.Contains(request.ToCollectionId))
            {
                return Forbid();
            }

            // Remove link from source
            var link = await _db.SignWordCollectionSignWords
                .FirstOrDefaultAsync(l => l.SignWordId == request.SignWordId && l.CollectionId == request.FromCollectionId);

            if (link != null)
            {
                _db.SignWordCollectionSignWords.Remove(link);
            }

            // Add link to target (nếu chưa có)
            bool existsInTarget = await _db.SignWordCollectionSignWords
                .AnyAsync(l => l.SignWordId == request.SignWordId && l.CollectionId == request.ToCollectionId);

            if (!existsInTarget)
            {
                var newLink = new SignWordCollectionSignWord
                {
                    CollectionId = request.ToCollectionId,
                    SignWordId = request.SignWordId,
                    AddedAt = DateTime.UtcNow
                };
                _db.SignWordCollectionSignWords.Add(newLink);
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                IsSuccess = true,
                Message = $"Đã di chuyển từ '{request.FromCollectionId}' sang '{request.ToCollectionId}'."
            });
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete("{collectionId}")]
        public async Task<IActionResult> DeleteCollection([FromRoute] string collectionId)
        {
            if (string.IsNullOrWhiteSpace(collectionId))
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "CollectionId is required." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { IsSuccess = false, ErrorMessage = "Missing user id claim (sub)." });
            }

            var collection = await _db.SignWordCollections
                .Include(c => c.SignWords)
                .FirstOrDefaultAsync(c => c.CollectionId == collectionId && c.CreatedBy == userId);

            if (collection == null)
            {
                return NotFound(new { IsSuccess = false, ErrorMessage = "Không tìm thấy bộ sưu tập này hoặc bạn không có quyền." });
            }

            if (collection.IsDefault)
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "Không thể xóa bộ sưu tập mặc định." });
            }

            // Xóa tất cả link words
            var links = _db.SignWordCollectionSignWords.Where(l => l.CollectionId == collectionId);
            _db.SignWordCollectionSignWords.RemoveRange(links);

            // Xóa collection
            _db.SignWordCollections.Remove(collection);

            await _db.SaveChangesAsync();

            return Ok(new { IsSuccess = true, Message = "Đã xóa bộ sưu tập thành công." });
        }
        [HttpGet("word_of_the_day")]
        public async Task<IActionResult> GetWordOfTheDay()
        {
            // Lấy tổng số từ
            var totalWords = await _db.SignWords.Where(s => s.Category != "Chữ cái").CountAsync();
            if (totalWords == 0)
            {
                return NotFound(new { IsSuccess = false, Message = "No words available" });
            }

            // Tạo chỉ số dựa trên ngày hiện tại
            var today = DateTime.UtcNow.Date;
            int hash = today.DayOfYear + today.Year;
            int index = hash % totalWords;

            // Lấy từ theo index
            var word = await _db.SignWords
                .Where(s => s.Category != "Chữ cái")
                .OrderBy(w => w.SignWordId)
                .Skip(index)
                .FirstOrDefaultAsync();

            if (word == null)
            {
                return NotFound(new { IsSuccess = false, Message = "No word found" });
            }

            return Ok(new
            {
                IsSuccess = true,
                Data = new
                {
                    word.SignWordId,
                    word.Word,
                    word.Category,
                    word.Definition,
                    word.SignWordUri,
                    word.ExampleSentence,
                    word.ExampleSentenceVideoUri
                }
            });
        }

        //[Authorize(AuthenticationSchemes = "Bearer")]
        //[HttpPost("remove_word_from_a_collection")]
        //public async Task<IActionResult> RemoveSignWordFromCollection([FromBody] RemoveSignWordFromCollectionRequest request)
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        //    var link = await _db.SignWordCollectionSignWords
        //        .FirstOrDefaultAsync(link => link.SignWordId == request.SignWordId
        //               && link.CollectionId == request.CollectionId);

        //    _db.SignWordCollectionSignWords.Remove(link);
        //    await _db.SaveChangesAsync();

        //    return Ok(new { IsSuccess = true });

        //}
    }
}


