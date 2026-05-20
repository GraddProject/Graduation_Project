using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string SessionName { get; set; } = string.Empty;

        public int PatientId { get; set; }
        public Patient Patient { get; set; } = default!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = default!;

        public int AvailabilitySlotId { get; set; }
        public AvailabilitySlot AvailabilitySlot { get; set; } = default!;

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Confirmed;

        public string? OnlineMeetingProvider { get; set; }
        public long? ZoomMeetingId { get; set; }
        public string? ZoomJoinUrl { get; set; }
        public string? ZoomStartUrl { get; set; }
        public string? ZoomPassword { get; set; }
        public DateTime? ZoomCreatedAt { get; set; }
        public DateTime? ZoomUpdatedAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
