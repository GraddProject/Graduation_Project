using Shared.DTos.NotificationDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.NotificationAbstraction
{
    public interface INotificationSender
    {
        Task SendToUserAsync(string userId, NotificationDto notification);
    }
}
