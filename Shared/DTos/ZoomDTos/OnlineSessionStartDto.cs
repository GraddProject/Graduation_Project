using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.ZoomDTos
{
    public class OnlineSessionStartDto
    {
        public int AppointmentId { get; set; }
        public string Provider { get; set; } = "Zoom";
        public string StartUrl { get; set; } = default!;
        public string? Password { get; set; }
        public DateTime StartAt { get; set; }
        public int DurationMinutes { get; set; }
        public bool CanStartNow { get; set; }
    }
}
