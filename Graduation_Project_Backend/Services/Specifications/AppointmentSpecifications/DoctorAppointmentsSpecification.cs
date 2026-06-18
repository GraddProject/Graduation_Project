using DomainLayer.Models;
using Shared.DTos.AppointmentDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
     class DoctorAppointmentsSpecification : BaseSpecifications<Appointment>
    {
        public DoctorAppointmentsSpecification(int doctorId, AppointmentStatus? status = null)
            : base(a =>
                a.DoctorId == doctorId &&
                (!status.HasValue || a.Status == status.Value))
        {
            AddInclude(a => a.Patient);
            AddInclude(a => a.Patient.User);
            AddInclude(a => a.AvailabilitySlot);

            AddOrderBy(a => a.AvailabilitySlot.StartAt);
        }
    }
}
