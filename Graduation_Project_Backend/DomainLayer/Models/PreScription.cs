using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class PreScription
    {
        public int Id { get; set; }

        public int? MedicalHistoryId { get; set; }
        public MedicalHistory MedicalHistory { get; set; } = default!;

        public string MedicationName { get; set; } = default!;
        public string Dosage { get; set; } = default!;
        public string Duration { get; set; } = default!;
        public string Instructions { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
    }
}