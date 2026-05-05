using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class DoctorPatientDto
    {
        public int PatientId { get; set; }
        public string DisplayName { get; set; }

        public string? ProfileImageUrl { get; set; }


        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public int? Age { get; set; }
        public string? BloodType { get; set; } = default!;
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public DateOnly? PregnancyStartDate { get; set; }
        public int? PregnancyWeek { get; set; }
        public string? Trimester { get; set; }
        public bool Actived { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
