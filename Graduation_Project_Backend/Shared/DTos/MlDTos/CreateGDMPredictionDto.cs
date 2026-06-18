using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class CreateGdmPredictionDto
    {
        public int PatientId { get; set; }

        public PredictionRequestDto Data { get; set; } = default!;
    }
}
