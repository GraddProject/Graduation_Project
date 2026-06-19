using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class DeleteAvailabilitySlotsDto
    {
        public List<int> SlotIds { get; set; } = new();
    }
}
