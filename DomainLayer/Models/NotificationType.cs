using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public enum NotificationType
    {
        AppointmentRequested = 0, // Legacy only
        AppointmentConfirmed = 1,
        AppointmentRescheduled = 2,
        AppointmentRescheduleAccepted = 3,
        AppointmentRescheduleRejected = 4,
        AppointmentCanceled = 5,
        AppointmentBooked = 6
    }
}
