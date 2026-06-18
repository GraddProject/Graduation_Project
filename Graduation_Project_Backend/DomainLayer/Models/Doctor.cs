using DomainLayer.IdentityModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Doctor
    {
        public int Id { get; set; }


        public int? YearsOfExperience { get; set; }

        public string UserId { get; set; }
        public string? Location { get; set; }
        public List<string>? Specializations { get; set; } = [];
        public ApplicationUser User { get; set; } = default!;


        public ICollection<Patient>? Patients { get; set; } = [];

        public ICollection<MedicalHistory> CreatedMedicalHistories { get; set; } = [];

        public ICollection<AvailabilitySlot>? AvailabilitySlots { get; set; } = [];

        public ICollection<Appointment>? Appointments { get; set; } = [];

        public ICollection<PredictionRecord>? PredictionRecords { get; set; } = [];

    }
}
