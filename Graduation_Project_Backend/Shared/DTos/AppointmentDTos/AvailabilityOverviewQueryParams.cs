using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class AvailabilityOverviewQueryParams
    {
        public AvailabilitySlotFilterDto Status { get; set; } = AvailabilitySlotFilterDto.All;

        public AppointmentType? Type { get; set; }

        public DayOfWeek? DayOfWeek { get; set; }

        public AvailabilityDateFilterDto DateFilter { get; set; } = AvailabilityDateFilterDto.All;
    }
}
