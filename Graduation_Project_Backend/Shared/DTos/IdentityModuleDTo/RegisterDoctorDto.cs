using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.IdentityModuleDTo
{
    public class RegisterDoctorDto
    {
        public string DisplayName { get; set; } = default!;

        [EmailAddress]
        public string Email { get; set; } = default!;

        [Phone]
        public string PhoneNumber { get; set; } = default!;

        //public string Specialization { get; set; } = default!;

        public int YearsOfExperience { get; set; }
    }
}
