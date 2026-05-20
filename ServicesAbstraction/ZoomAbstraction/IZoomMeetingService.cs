using Shared.DTos.ZoomDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.ZoomAbstraction
{
    public interface IZoomMeetingService
    {
        Task<ZoomMeetingResult> CreateMeetingAsync(string topic, DateTime startAt, TimeSpan duration, CancellationToken cancellationToken = default);
        Task<ZoomMeetingResult?> GetMeetingAsync(long meetingId, CancellationToken cancellationToken = default);
        Task UpdateMeetingAsync(long meetingId, string topic, DateTime startAt, TimeSpan duration, CancellationToken cancellationToken = default);
        Task DeleteMeetingAsync(long meetingId, CancellationToken cancellationToken = default);
    }
}
