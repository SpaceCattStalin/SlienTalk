using API.DTOs;
using API.Entities;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("signwords")]
        public async Task<IActionResult> GetSignWords([FromQuery] AdminSignWordsFilterRequest filter)
        {
            var query = _context.SignWords.AsQueryable();

            if (!String.IsNullOrEmpty(filter.Keyword))
            {
                query = query.Where(sw =>
                    sw.Word.ToUpper().Contains(filter.Keyword.ToUpper())
                    || sw.Category.ToUpper().Contains(filter.Keyword.ToUpper())
                    || sw.WordType.ToUpper().Contains(filter.Keyword.ToUpper())
                );
            }

            if (filter.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == filter.IsActive.Value);
            }

            if (!string.IsNullOrEmpty(filter.Category))
            {
                query = query.Where(x => x.Category.ToUpper() == filter.Category.ToUpper());
            }

            if (!string.IsNullOrEmpty(filter.WordType))
            {
                query = query.Where(x => x.WordType.ToUpper() == filter.WordType.ToUpper());
            }

            if (filter.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == filter.IsActive.Value);
            }

            switch (filter.SortBy)
            {
                case "name_desc":
                    query = query.OrderByDescending(x => x.Word);
                    break;
                case "name":
                    query = query.OrderBy(x => x.Word);
                    break;
                case "type_desc":
                    query = query.OrderByDescending(x => x.WordType);
                    break;
                case "type":
                    query = query.OrderBy(x => x.WordType);
                    break;
                case "cat_desc":
                    query = query.OrderByDescending(x => x.Category);
                    break;
                case "cat":
                    query = query.OrderBy(x => x.Category);
                    break;
                default:
                    query = query.OrderBy(x => x.CreatedAt);
                    break;
            }
            var totalItems = await query.CountAsync();
            //}
            var paginatedResult = new
            {
                data = await query.Skip((filter.CurrentPage - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync(),
                currentPage = filter.CurrentPage,
                pageSize = filter.PageSize,
                totalPages = (int)Math.Ceiling((double)query.ToList().Count() / filter.PageSize),
                totalItems = totalItems
            };


            return Ok(paginatedResult);
        }

        [HttpGet("signwords/{id}")]
        public async Task<ActionResult<SignWord>> GetSignWord(string id)
        {
            var signWord = await _context.SignWords.FindAsync(id);

            if (signWord == null)
            {
                return NotFound();
            }

            return Ok(signWord);
        }

        [HttpPut("signwords/{id}")]
        public async Task<IActionResult> PutSignWord(string id, SignWordUpdateRequest signWordToUpdate)
        {
            var signWord = await _context.SignWords.FindAsync(id);

            if (signWord == null)
            {
                return BadRequest($"Signword với id {id} không tồn tại!");
            }

            _context.Entry(signWord).State = EntityState.Modified;

            signWord.Word = signWordToUpdate.Word;
            signWord.Category = signWordToUpdate.Category;
            signWord.Definition = signWordToUpdate.Definition;
            signWord.WordType = signWordToUpdate.WordType;
            signWord.IsActive = signWordToUpdate.IsActive.HasValue ? signWordToUpdate.IsActive.Value : signWord.IsActive;
            signWord.ExampleSentence = signWordToUpdate.ExampleSentence;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SignWordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost("signwords")]
        public async Task<ActionResult<SignWord>> PostSignWord(CreateSignWordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newSignWord = new SignWord
            {
                SignWordId = Guid.NewGuid().ToString(),
                Word = dto.Word,
                Category = dto.Category,
                Definition = dto.Definition,
                WordType = dto.WordType,
                //SignWordUri = dto.SignWordUri,
                ExampleSentence = dto.ExampleSentence,
                ExampleSentenceVideoUri = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.SignWords.Add(newSignWord);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SignWordExists(newSignWord.SignWordId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(
                "GetSignWord",
                new { id = newSignWord.SignWordId },
                newSignWord
            );
        }

        [HttpDelete("signwords/{id}")]
        public async Task<IActionResult> DeleteSignWord(string id)
        {
            var signWord = await _context.SignWords.FindAsync(id);
            if (signWord == null)
            {
                return NotFound();
            }

            _context.SignWords.Remove(signWord);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SignWordExists(string id)
        {
            return _context.SignWords.Any(e => e.SignWordId == id);
        }

        [HttpPost("upload-video/{signWordId}")]
        public async Task<IActionResult> UploadVideos(string signWordId, IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest(new { Message = "File không để trống" });
                }


                // var videosFolder = Path.Combine(Directory.GetCurrentDirectory(), "Static", "videos");

                //var videosFolder = Path.Combine("Static", "videos");
                var videosFolder = Path.Combine(Directory.GetCurrentDirectory(), "Static", "video");

                if (!Directory.Exists(videosFolder))
                {
                    Directory.CreateDirectory(videosFolder);
                }



                if (signWordId != null)
                {
                    var signWord = await _context.SignWords.FindAsync(signWordId);
                    if (signWord == null)
                    {
                        return BadRequest(new { Message = $"Signword với ID = {signWordId} không tồn tại" });
                    }

                    var fileExtension = Path.GetExtension(file.FileName);
                    var uniqueFilename = $"{Guid.NewGuid()}{fileExtension}";

                    var videoUrl = Path.Combine(videosFolder, uniqueFilename);
                    var publicUrl = $"/Static/video/{uniqueFilename}";
                    using (var stream = new FileStream(videoUrl, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    ;

                    signWord.SignWordUri = publicUrl;
                    signWord.UpdatedAt = DateTime.UtcNow;
                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        System.IO.File.Delete(videoUrl);
                        throw (ex);
                    }
                }

                return Ok(new { Message = "Upload thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lưu vào DB: {ex}");
            }
        }

        [HttpPost("upload-3d/{signWordId}")]
        public async Task<IActionResult> UploadSignwords3d(string signWordId, IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest(new { Message = "File không để trống" });
                }


                // var videosFolder = Path.Combine(Directory.GetCurrentDirectory(), "Static", "videos");

                //var videosFolder = Path.Combine("Static", "videos");
                var videosFolder = Path.Combine(Directory.GetCurrentDirectory(), "Static", "3d");

                if (!Directory.Exists(videosFolder))
                {
                    Directory.CreateDirectory(videosFolder);
                }



                if (signWordId != null)
                {
                    var signWord = await _context.SignWords.FindAsync(signWordId);
                    if (signWord == null)
                    {
                        return BadRequest(new { Message = $"Signword với ID = {signWordId} không tồn tại" });
                    }

                    var fileExtension = Path.GetExtension(file.FileName);
                    var uniqueFilename = $"{Guid.NewGuid()}{fileExtension}";

                    var videoUrl = Path.Combine(videosFolder, uniqueFilename);
                    var publicUrl = $"/Static/3d/{uniqueFilename}";
                    using (var stream = new FileStream(videoUrl, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    ;

                    signWord.SignWordUri = publicUrl;
                    signWord.UpdatedAt = DateTime.UtcNow;
                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        System.IO.File.Delete(videoUrl);
                        throw (ex);
                    }
                }

                return Ok(new { Message = "Upload thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lưu vào DB: {ex}");
            }
        }

        [HttpGet("payments")]
        public async Task<IActionResult> GetPayments([FromQuery] AdminPaymentFilterRequest filter)
        {
            var query = _context.Payments
                .Include(p => p.UserPlan)
                    .ThenInclude(up => up.User)
                    .AsQueryable();

            if (!String.IsNullOrEmpty(filter.Keyword))
            {
                string keyword = filter.Keyword.ToUpper();

                query = query.Where(p =>
                    p.UserPlan.User.Email.ToUpper().Contains(keyword)
                );
            }

            List<AdminPaymentRespond> payments = new List<AdminPaymentRespond>();

            var inform = await query.Skip((filter.CurrentPage - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync();

            foreach (var p in inform)
            {
                var a = new AdminPaymentRespond
                {
                    Email = p.UserPlan.User.Email,
                    Name = p.UserPlan.User.Name,
                    PhoneNumber = p.UserPlan.User.PhoneNumber,
                    PaymentId = p.PaymentId,
                    UserPlanId = p.UserPlanId,
                    Amount = p.Amount,
                    Currency = p.Currency,
                    PaymentDate = p.PaymentDate,
                    Status = p.Status,
                    PaymentMethod = p.PaymentMethod,
                    CreatedAt = p.CreatedAt,
                    UpdateAt = p.UpdateAt,
                };
                payments.Add(a);
            }

            var paginatedResult = new
            {
                //data = await query.Skip((filter.CurrentPage - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync(),
                data = payments,
                currentPage = filter.CurrentPage,
                pageSize = filter.PageSize,
                totalPages = (int)Math.Ceiling((double)query.ToList().Count() / filter.PageSize),
            };


            return Ok(paginatedResult);
        }
    }
}
