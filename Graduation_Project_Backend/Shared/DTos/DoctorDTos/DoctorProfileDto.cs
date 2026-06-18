using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class DoctorProfileDto
    {
        public int DoctorId { get; set; }

        public string DisplayName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string? Location { get; set; }

        public string Status { get; set; }

        public int? YearsOfExperience { get; set; }

        public int PatientsCount { get; set; }

        public string? ProfileImageUrl { get; set; }

        public List<string> Specializations { get; set; } = [];
    }
}
