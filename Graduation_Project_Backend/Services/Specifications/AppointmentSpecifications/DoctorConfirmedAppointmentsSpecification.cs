using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class DoctorConfirmedAppointmentsSpecification : BaseSpecifications<Appointment>
    {
        public DoctorConfirmedAppointmentsSpecification(int doctorId)
            :base(A=>A.DoctorId == doctorId && A.Status == AppointmentStatus.Confirmed)
        {
            AddInclude(A => A.AvailabilitySlot);
        }
    }
}
