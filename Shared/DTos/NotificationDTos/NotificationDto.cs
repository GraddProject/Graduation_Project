using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.NotificationDTos
{
    public class NotificationDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = default!;
        public string Message { get; set; } = default!;

        public string Type { get; set; } = default!;

        public bool IsRead { get; set; }

        //public int? AppointmentId { get; set; }

        public string? RelatedEntityType { get; set; }
        public int? RelatedEntityId { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
