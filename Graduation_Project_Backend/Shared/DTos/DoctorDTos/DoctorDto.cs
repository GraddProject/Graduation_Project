using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class DoctorDto
    {
        public int Id { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string Role { get; set; } = "Doctor";
        public int YearsOfExperience { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }
        public int PatientsCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Actived { get; set; }
    }
}
