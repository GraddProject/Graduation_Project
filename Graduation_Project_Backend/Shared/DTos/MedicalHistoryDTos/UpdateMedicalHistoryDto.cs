using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalHistoryDTos
{
    public class UpdateMedicalHistoryDto
    {
        public string? Diagnosis { get; set; }
        public string? VitalSigns { get; set; }
        public string? Notes { get; set; }
    }
}
