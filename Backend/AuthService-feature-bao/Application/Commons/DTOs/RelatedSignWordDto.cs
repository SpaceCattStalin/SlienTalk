using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commons.DTOs
{
    public class RelatedSignWordDto
    {
        public string RelatedSignWordId { get; set; }
        public string Word { get; set; } = default!;
        public string? Notes { get; set; }
    }

}
