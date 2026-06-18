using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PatientDTos
{
    public class UpdatePatientDto
    {
        public string? DisplayName { get; set; } 
        public string? PhoneNumber { get; set; } 
        public string? BloodType { get; set; } 
        public int? Height { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public DateOnly? PregnancyStartDate { get; set; }
        public int? Weight { get; set; }
        public int? NumberOfPregnancies { get; set; }
        public int? DoctorID { get; set; }
    }
}
