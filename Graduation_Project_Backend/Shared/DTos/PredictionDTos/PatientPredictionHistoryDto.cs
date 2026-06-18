using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PredictionDTos
{
    public class PatientPredictionHistoryDto
    {
        public int PredictionRecordId { get; set; }

        public string Month { get; set; } = default!;
        public int Day { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Type { get; set; } = default!;
        public string RiskLevel { get; set; } = default!;

        public decimal Confidence { get; set; }

        public int? MedicalHistoryId { get; set; }
    }
}
