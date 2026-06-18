using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class AvailabilitySlotDto
    {
        public int Id { get; set; }
        public DateTime StartAt { get; set; }
        public int DurationInMinutes { get; set; }
        public AppointmentType Type { get; set; }
        public bool IsBooked { get; set; }
    }
}
