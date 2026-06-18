using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class DoctorPatientCardDto
    {
        public int PatientId { get; set; }

        public string DisplayName { get; set; } = default!;
        public string? ProfileImageUrl { get; set; }

        public string Email { get; set; } = default!;

        public int? PregnancyWeek { get; set; }

        public string? Trimester { get; set; }

        public string RiskLevel { get; set; } = "Not Predicted";

        public DateTime? LastAppointmentAt { get; set; }

        public DateTime? NextAppointmentAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
