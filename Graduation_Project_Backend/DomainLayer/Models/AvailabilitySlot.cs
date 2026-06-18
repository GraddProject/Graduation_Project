using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class AvailabilitySlot
    {
        public int Id {  get; set; }
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = default!;
        public DateTime StartAt { get; set; }
        public TimeSpan Duration { get; set; }
        public AppointmentType Type { get; set; }
        public Appointment? Appointment { get; set; } // 1-1(Appointment)
    }
}
