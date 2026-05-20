using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.ZoomDTos
{
    public class ZoomMeetingResult
    {
        public long Id { get; set; }
        public string JoinUrl { get; set; } = default!;
        public string StartUrl { get; set; } = default!;
        public string? Password { get; set; }
    }
}
