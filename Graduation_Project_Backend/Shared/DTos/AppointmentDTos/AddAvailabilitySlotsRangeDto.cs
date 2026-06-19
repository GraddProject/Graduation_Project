using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class AddAvailabilitySlotsRangeDto
    {
        public DateTime StartAt { get; set; }

        public DateTime EndAt { get; set; }

        public int SessionDurationInMinutes { get; set; }

        public AppointmentType Type { get; set; }
    }
}
