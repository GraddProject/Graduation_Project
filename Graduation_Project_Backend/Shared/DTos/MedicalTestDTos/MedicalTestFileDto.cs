using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalTestDTos
{
    public class MedicalTestFileDto
    {
        public byte[] Content { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public string FileName { get; set; } = default!;
    }
}
