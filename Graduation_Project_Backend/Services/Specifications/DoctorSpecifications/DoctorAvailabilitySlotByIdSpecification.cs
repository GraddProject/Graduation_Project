using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class DoctorAvailabilitySlotByIdSpecification : BaseSpecifications<AvailabilitySlot>
    {
        public DoctorAvailabilitySlotByIdSpecification(int slotId, int doctorId):base(A=>A.Id == slotId && A.DoctorId == doctorId)
        {
            AddInclude(A => A.Appointment);
        }
    }
}
