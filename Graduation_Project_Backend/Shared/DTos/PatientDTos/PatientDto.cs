using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PatientDTos
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string DisplayName { get; set; } = default!;
        public string Email { get; set; }
        public string Role { get; set; } = "Patient";
        public string DoctorName { get; set; } = default!;
        public DateOnly DateOfBirth { get; set; }
        public string PhoneNumber { get; set; } = default!;
        public string BloodType { get; set; } = default!;
        public int Height { get; set; }
        public int Age { get; set; }
        public int Weight { get; set; }
        public int PregnancyWeek { get; set; }
        public int NumberOfPregnancies { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Actived { get; set; }

    }
}
