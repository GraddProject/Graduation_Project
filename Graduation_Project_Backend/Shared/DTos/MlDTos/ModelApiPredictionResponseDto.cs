using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class ModelApiPredictionResponseDto
    {
        [JsonPropertyName("label")]
        public string Label { get; set; } = default!;

        [JsonPropertyName("probability")]
        public decimal Probability { get; set; }
    }
}
