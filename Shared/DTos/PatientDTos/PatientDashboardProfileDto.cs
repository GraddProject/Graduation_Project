using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PatientDTos
{
    public class PatientDashboardProfileDto
    {
        public int PatientId { get; set; }

        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }

        public string? PregnancyLabel { get; set; }
        public string? Trimester { get; set; }
        public int? PregnancyWeek { get; set; }
        public int? DaysToEstimatedDueDate { get; set; }

        public string? BloodType { get; set; }
        public int? HeightCm { get; set; }
        public int? WeightKg { get; set; }
        public int? NumberOfPregnancies { get; set; }

        public string GdmRisk { get; set; } = "Not Predicted";
        public decimal? GdmConfidencePercentage { get; set; }

        public string PreeclampsiaRisk { get; set; } = "Not Predicted";
        public decimal? PreeclampsiaConfidencePercentage { get; set; }

        public string? DateOfBirth { get; set; }

        public PatientDashboardDoctorDto? Doctor { get; set; }
    }

    public class PatientDashboardDoctorDto
    {
        public int DoctorId { get; set; }

        public string DisplayName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }

        public int? YearsOfExperience { get; set; }
        public string? Location { get; set; }
        public List<string> Specializations { get; set; } = [];
    }
}
