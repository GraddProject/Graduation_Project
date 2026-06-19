using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class AvailabilitySlotForBookingSpecification : BaseSpecifications<AvailabilitySlot>
    {
        public AvailabilitySlotForBookingSpecification(int slotId) :base(As => As.Id == slotId)
        {

            AddInclude(s => s.Doctor);
            AddInclude(s => s.Doctor.User);
            AddInclude(s => s.Appointment);
        }
    }
}
