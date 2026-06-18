using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class RescheduleAppointmentDto
    {
        public DateTime NewStartAt { get; set; }

        public int DurationMinutes { get; set; }

        public AppointmentType Type { get; set; }
    }
}
