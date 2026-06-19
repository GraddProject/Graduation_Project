using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.AppointmentDTos
{
    public class PatientAppointmentDto
    {
        public int Id { get; set; }

        public string Date { get; set; }
        public string DateLabel { get; set; }
        public string Time { get; set; }
        public string Duration { get; set; }

        public string DoctorName { get; set; }

        public string AppointmentType { get; set; }

        public string VisitType { get; set; }

        public string Status { get; set; }
        public bool IsOnline { get; set; }
        public bool CanJoinOnlineSession { get; set; }
        public string? OnlineSessionUrl { get; set; }
    }
}
