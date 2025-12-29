using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commons.DTOs
{
    public class RemoveSignWordFromCollectionRequest
    {
        public string SignWordId { get; set; } = default!;
        public string? CollectionId { get; set; }
    }
}
