using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class CompleteDoctorProfileDto
    {
        public string? Location { get; set; }

        public IFormFile? ProfileImage { get; set; }
    }
}
