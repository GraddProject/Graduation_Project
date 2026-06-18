using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class DoctorDashboardOverviewDto
    {
        public DoctorAppointmentOverviewDto AppointmentOverview { get; set; } = new();
        public DoctorAvailabilityDashboardDto Availability { get; set; } = new();
    }

    public class DoctorAppointmentOverviewDto
    {
        public DoctorDashboardStatusDto Confirmed { get; set; } = new();
        public DoctorDashboardStatusDto Completed { get; set; } = new();
        public DoctorDashboardStatusDto Canceled { get; set; } = new();
    }

    public class DoctorDashboardStatusDto
    {
        public int Count { get; set; }
        public int Percentage { get; set; }
    }

    public class DoctorAvailabilityDashboardDto
    {
        public int BookedPercentage { get; set; }

        public int BookedSlots { get; set; }
        public int AvailableSlots { get; set; }
        public int ExpiredSlots { get; set; }

        public int OnlineBookedSlots { get; set; }
        public int OfflineBookedSlots { get; set; }
    }
}
