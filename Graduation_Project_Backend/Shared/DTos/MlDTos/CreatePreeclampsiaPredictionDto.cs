using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class CreatePreeclampsiaPredictionDto
    {
        public int PatientId { get; set; }

        public PreeclampsiaPredictionRequestDto Data { get; set; } = default!;
    }
}
