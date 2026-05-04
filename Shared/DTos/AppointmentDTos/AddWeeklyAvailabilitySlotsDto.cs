using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class AddWeeklyAvailabilitySlotsDto
    {
        public DateTime StartDate { get; set; }

        public List<DayOfWeek> DaysOfWeek { get; set; } = new();

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int SessionDurationInMinutes { get; set; }

        public AppointmentType Type { get; set; }

        public int RepeatForWeeks { get; set; } = 1;
    }
}
