using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class AvailableDoctorSlotsSpecification : BaseSpecifications<AvailabilitySlot>
    {
        public AvailableDoctorSlotsSpecification(int doctorId)
            : base(slot =>
                slot.DoctorId == doctorId &&
                slot.StartAt > DateTime.Now &&
                slot.Appointment == null)
        {
            AddOrderBy(slot => slot.StartAt);
        }
    }
}
