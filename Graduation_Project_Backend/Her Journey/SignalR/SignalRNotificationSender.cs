using Her_Journey.Hubs;
using Microsoft.AspNetCore.SignalR;
using ServicesAbstraction.NotificationAbstraction;
using Shared.DTos.NotificationDTos;

namespace Her_Journey.SignalR
{
    public class SignalRNotificationSender(
        IHubContext<NotificationHub> _hubContext) : INotificationSender
    {
        public async Task SendToUserAsync(string userId, NotificationDto notification)
        {
            await _hubContext
                .Clients
                .User(userId)
                .SendAsync("ReceiveNotification", notification);
        }
    }
}
