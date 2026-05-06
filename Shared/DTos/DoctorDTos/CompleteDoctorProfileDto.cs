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
        public IFormFile? ProfileImage { get; set; }
        public string? Location { get; set; }
        public int? YearsOfExperience { get; set; }

        public List<string>? Specializations { get; set; }


    }
}
