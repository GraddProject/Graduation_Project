using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class DoctorAvailabilitySlotsByIdsSpecification : BaseSpecifications<AvailabilitySlot>
    {
        public DoctorAvailabilitySlotsByIdsSpecification(int doctorId, IEnumerable<int> slotIds)
            : base(s =>
                s.DoctorId == doctorId &&
                slotIds.Contains(s.Id))
        {
            AddInclude(s => s.Appointment);
        }
    }
}
