using DomainLayer.IdentityModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Patient
    {
        public int Id { get; set; }


        


        public MedicalData MedicalInfo { get; set; } = new MedicalData();

        public string UserId { get; set; }

        public ApplicationUser User { get; set; } = default!;

        public int DoctorID { get; set; }

        public Doctor Doctor { get; set; } = default!;

        public ICollection<MedicalHistory>? MedicalHistory { get; set; } = [];

        public ICollection<Appointment>? Appointments { get; set; } = [];

        public ICollection<MedicalTest>? MedicalTests { get; set; } = [];

        public ICollection<PredictionRecord>? PredictionRecords { get; set; } = [];
    }
}
