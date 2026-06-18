using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
     class DashBoardDoctorAppointmentsSpecification : BaseSpecifications<Appointment>
    {
        public DashBoardDoctorAppointmentsSpecification(int doctorId, AppointmentStatus? status = null)
            : base(a =>
                a.DoctorId == doctorId &&
                (
                    status.HasValue
                        ? a.Status == status.Value

                        : (
                            (
                                a.AvailabilitySlot.StartAt >= DateTime.Now &&
                                a.Status == AppointmentStatus.Confirmed
                            )
                            ||
                            a.Status == AppointmentStatus.Completed
                        )
                )
            )
        {
            AddInclude(a => a.Patient);
            AddInclude(a => a.Patient.User);
            AddInclude(a => a.AvailabilitySlot);

            AddOrderBy(a => a.AvailabilitySlot.StartAt);
        }
    }
}
