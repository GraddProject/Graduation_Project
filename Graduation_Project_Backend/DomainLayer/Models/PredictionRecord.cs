using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class PredictionRecord
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; } = default!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = default!;

        public PredictionType Type { get; set; }

        public string Result { get; set; } = default!;

        public decimal Confidence { get; set; }

        public string InputJson { get; set; } = default!;

        public string RawResponseJson { get; set; } = default!;

        public DateTime CreatedAt { get; set; }

        public MedicalHistory? MedicalHistory { get; set; }
    }
}
