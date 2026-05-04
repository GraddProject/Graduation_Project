using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class DoctorAvailabilitySlotsSpecification : BaseSpecifications<AvailabilitySlot>
    {
        public DoctorAvailabilitySlotsSpecification(int doctorId)
        : base(a => a.DoctorId == doctorId)
        {
            AddInclude(a => a.Appointment);
            AddOrderBy(s => s.StartAt);
        }
    }
}
