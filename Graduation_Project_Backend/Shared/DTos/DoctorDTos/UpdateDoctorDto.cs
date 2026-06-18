using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class UpdateDoctorDto
    {
        public string? DisplayName { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        public int? YearsOfExperience { get; set; }
    }
}
