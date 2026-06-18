using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class ModelApiOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string PredictEndpoint { get; set; } = string.Empty;
    }
}
