using DomainLayer.IdentityModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public string UserId { get; set; } = default!;
        public ApplicationUser User { get; set; } = default!;

        public string Title { get; set; } = default!;
        public string Message { get; set; } = default!;

        public NotificationType Type { get; set; }

        public bool IsRead { get; set; } = false;

        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
