using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public enum AppointmentStatus
    {
        Pending = 0, // Legacy only - don't use it anymore
        Confirmed = 1,
        Canceled = 2,
        ReschedulePending = 3,
        Completed=4
    }
}
