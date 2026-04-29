using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class PatientAppointmentByIdSpecification : BaseSpecifications<Appointment>
    {
        public PatientAppointmentByIdSpecification(int patientId, int appointmentId)
            : base(a => a.Id == appointmentId && a.PatientId == patientId)
        {
            AddInclude(a => a.Patient);
            AddInclude(a => a.Patient.User);

            AddInclude(a => a.Doctor);
            AddInclude(a => a.Doctor.User);

            AddInclude(a => a.AvailabilitySlot);
        }
    }
}
