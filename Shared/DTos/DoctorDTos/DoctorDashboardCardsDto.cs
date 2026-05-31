using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DoctorDTos
{
    public class DoctorDashboardCardsDto
    {
        public int TotalPatients { get; set; }
        public int AppointmentsToday { get; set; }
        public int HighRiskCases { get; set; }
    }
}
