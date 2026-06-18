using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalHistoryDTos
{
    public class PreScriptionDto
    {
        public int Id { get; set; }
        public string MedicationName { get; set; } 
        public string Dosage { get; set; } 
        public string Duration { get; set; }
        public string Instructions { get; set; } 
        public DateTime CreatedAt { get; set; }
    }
}
