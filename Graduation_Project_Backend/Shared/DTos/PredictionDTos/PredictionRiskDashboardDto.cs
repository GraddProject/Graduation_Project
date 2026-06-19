using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PredictionDTos
{
    public class PredictionRiskDashboardDto
    {
        public string Type { get; set; } = default!;
        public string Title { get; set; } = default!;

        public int TotalPatients { get; set; }

        public int HighLevelPatients { get; set; }
        public int ModerateLevelPatients { get; set; }
        public int LowLevelPatients { get; set; }
    }
}
