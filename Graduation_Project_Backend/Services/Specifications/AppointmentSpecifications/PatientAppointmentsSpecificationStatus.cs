using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class PatientAppointmentsSpecificationStatus : BaseSpecifications<Appointment>
    {
        public PatientAppointmentsSpecificationStatus(int patientId, AppointmentStatus? status = null)
            : base(A => A.PatientId == patientId && (!status.HasValue || A.Status == status.Value))
        {
            AddInclude(A => A.AvailabilitySlot);
            AddInclude(a => a.Doctor);
            AddInclude(a => a.Doctor.User);

            AddOrderBy(A => A.AvailabilitySlot.StartAt);
        }
    }
}
