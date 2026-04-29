using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public enum AppointmentStatusDto
    {
        Pending = 0,
        Confirmed = 1,
        Canceled = 2,
        ReschedulePending = 3,
        Completed=4
    }
}
