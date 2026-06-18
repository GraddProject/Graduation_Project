using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalHistoryDTos
{
    public class PatientLastVisitSummaryDto
    {
        public int? MedicalHistoryId { get; set; }

        public string? Date { get; set; } = string.Empty;

        public string? Diagnosis { get; set; } = string.Empty;

        public string? VitalSigns { get; set; }

        public string? Notes { get; set; }

    }
}
