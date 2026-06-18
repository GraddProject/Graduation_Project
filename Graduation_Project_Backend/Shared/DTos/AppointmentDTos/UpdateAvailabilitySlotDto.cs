using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class UpdateAvailabilitySlotDto
    {
        public DateTime StartAt { get; set; }
        [Range(1, 600)]
        public int DurationInMinutes { get; set; }
        public AppointmentType Type { get; set; }
    }
}
