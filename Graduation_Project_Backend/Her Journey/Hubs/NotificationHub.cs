using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Her_Journey.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
    }
}
