using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PredictionDTos
{
    public class PredictionDetailsDto
    {
        public int PredictionRecordId { get; set; }

        public string PatientName { get; set; } = default!;

        public string Type { get; set; } = default!;

        public string Date { get; set; } = default!;

        public string Result { get; set; } = default!;

        public decimal Confidence { get; set; }

        public string InputJson { get; set; } = default!;

        public string RawResponseJson { get; set; } = default!;
    }
}
