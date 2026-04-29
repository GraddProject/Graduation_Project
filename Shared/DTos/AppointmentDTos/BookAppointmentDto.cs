using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class BookAppointmentDto
    {
        public int SlotId { get; set; }

        [MaxLength(100)]
        public string? SessionName { get; set; }
    }
}
