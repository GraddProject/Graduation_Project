using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class DoctorAppointmentsSummarySpecification : BaseSpecifications<Appointment>
    {
        public DoctorAppointmentsSummarySpecification(int doctorId)
            : base(a => a.DoctorId == doctorId)
        {
            AddInclude(a => a.AvailabilitySlot);
        }
    }
}
