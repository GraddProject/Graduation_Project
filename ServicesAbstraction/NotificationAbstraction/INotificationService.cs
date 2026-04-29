using Shared.DTos.NotificationDTos;
using Shared.ErrorModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.NotificationAbstraction
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateAndSendAsync(
            string userId,
            string title,
            string message,
            NotificationTypeDto type,
            int? appointmentId = null);

        Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(string userId);

        Task<int> GetUnreadCountAsync(string userId);

        Task<ServiceResponse> MarkAsReadAsync(string userId, int notificationId);

        Task<ServiceResponse> MarkAllAsReadAsync(string userId);
    }
}
