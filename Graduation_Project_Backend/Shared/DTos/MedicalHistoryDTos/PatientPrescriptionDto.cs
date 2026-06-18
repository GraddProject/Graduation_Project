using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalHistoryDTos
{
    public class PatientPrescriptionDto
    {
        public string MedicationName { get; set; } = default!;
        public string Dosage { get; set; } = default!;
        public string Duration { get; set; } = default!;
        public string Instructions { get; set; } = default!;
    }
}
