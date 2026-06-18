using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalHistoryDTos
{
    public class AddPreScriptionsDto
    {
        public List<AddPreScriptionDto> PreScriptions { get; set; } = [];
    }
}
