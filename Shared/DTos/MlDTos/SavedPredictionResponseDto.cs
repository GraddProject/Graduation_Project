using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class SavedPredictionResponseDto
    {
        public int PredictionRecordId { get; set; }

        public int PatientId { get; set; }

        public string Type { get; set; } = default!;

        public string Result { get; set; } = default!;

        public decimal Confidence { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
