using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class DoctorAppointmentSummaryDto
    {
        public int TotalAppointments { get; set; }

        public int Upcoming { get; set; }

        public int Completed { get; set; }

        public int Pending { get; set; }
        public int ReschedulePending { get; set; }

    }
}
