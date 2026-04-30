using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class DoctorAvailabilityOverviewDto
    {
        public int Id { get; set; }

        public string Date { get; set; } = default!;
        public string DateLabel { get; set; } = default!;
        public string Time { get; set; } = default!;
        public string Duration { get; set; } = default!;

        public string VisitType { get; set; } = default!;

        public string BookingStatus { get; set; } = default!;
        public string? AppointmentStatus { get; set; }

        public string DisplayStatus { get; set; } = default!;
    }
}
