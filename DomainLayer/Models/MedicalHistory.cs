using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class MedicalHistory
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; } = default!;

        public int CreatedByDoctorId { get; set; }
        public Doctor CreatedByDoctor { get; set; } = default!;


        public int? PredictionRecordId { get; set; }

        public PredictionRecord? PredictionRecord { get; set; }


        public string Diagnosis { get; set; } = default!;
        public string? VitalSigns { get; set; }
        public string? Notes { get; set; }


        public DateTime CreatedAt { get; set; }

        public ICollection<PreScription> PreScriptions { get; set; } = [];

    }
}
