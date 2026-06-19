using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class DoctorAppointmentByIdSpecification : BaseSpecifications<Appointment>
    {
        public DoctorAppointmentByIdSpecification(int doctorId, int appointmentId)
            : base(a => a.Id == appointmentId && a.DoctorId == doctorId)
        {
            AddInclude(a => a.Patient);
            AddInclude(a => a.Patient.User);
            AddInclude(a => a.AvailabilitySlot);
        }
    }
}
