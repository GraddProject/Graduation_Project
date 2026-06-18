using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class PatientConfirmedAppointmentsSpecification : BaseSpecifications<Appointment>
    {
        public PatientConfirmedAppointmentsSpecification(int patientId)
            : base(a =>
                a.PatientId == patientId &&
                a.Status == AppointmentStatus.Confirmed)
        {
            AddInclude(a => a.AvailabilitySlot);
        }
    }
}
