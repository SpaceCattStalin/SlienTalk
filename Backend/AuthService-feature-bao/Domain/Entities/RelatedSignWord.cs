using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RelatedSignWord
    {
        public string Id { get; set; }

        public string SignWordId { get; set; }


        public string RelatedSignWordId { get; set; }

        public string? Notes { get; set; }

        public SignWord SignWord { get; set; } = default!;
        public SignWord RelatedSignWordRef { get; set; } = default!;
    }
}
