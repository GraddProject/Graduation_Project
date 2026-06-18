using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.IdentityModuleDTo
{
    public class RegisterPatientDto
    {
        public string DisplayName { get; set; } = default!;

        [EmailAddress]
        public string Email { get; set; } = default!;

        [Phone]
        public string PhoneNumber { get; set; } = default!;

        //public string? BloodType { get; set; } = default!;

        //public DateOnly? DateOfBirth { get; set; }

        //public int? Height { get; set; }
        //public int? Age { get; set; }
        //public int? Weight { get; set; }
        //public int? PregnancyWeek { get; set; }
        //public int? NumberOfPregnancies { get; set; }

        public int DoctorId { get; set; }
    }
}
