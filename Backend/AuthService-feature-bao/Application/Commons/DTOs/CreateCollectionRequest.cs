using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commons.DTOs
{
    public class CreateCollectionRequest
    {
        public string Name { get; set; } = default!;
        public bool IsDefault { get; set; } = false;
    }
}
