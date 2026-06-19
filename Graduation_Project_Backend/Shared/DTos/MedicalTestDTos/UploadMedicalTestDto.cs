using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalTestDTos
{
    public class UploadMedicalTestDto
    {
        public IFormFile File { get; set; } = default!;
    }
}
