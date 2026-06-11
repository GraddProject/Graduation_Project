using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class PatientLastCompletedAppointmentSpecification : BaseSpecifications<Appointment>
    {
        public PatientLastCompletedAppointmentSpecification(int patientId)
            : base(a =>
                a.PatientId == patientId &&
                a.Status == AppointmentStatus.Completed)
        {
            AddInclude(a => a.AvailabilitySlot);

            AddOrderByDescending(a => a.AvailabilitySlot.StartAt);
        }
    }
}
