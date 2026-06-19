using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared.DTos.NotificationDTos;
using Shared.ErrorModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Authorize]
    public class NotificationsController(IServiceManger _serviceManger) : ApiBaseController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetMyNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var result = await _serviceManger.NotificationService.GetUserNotificationsAsync(userId);

            return Ok(result);
        }

        [HttpGet("UnreadCount")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var result = await _serviceManger.NotificationService.GetUnreadCountAsync(userId);

            return Ok(result);
        }

        [HttpPut("MarkAsRead/{notificationId}")]
        public async Task<ActionResult<ServiceResponse>> MarkAsRead(int notificationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var result = await _serviceManger.NotificationService.MarkAsReadAsync(userId, notificationId);

            return Ok(result);
        }

        [HttpPut("MarkAllAsRead")]
        public async Task<ActionResult<ServiceResponse>> MarkAllAsRead()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var result = await _serviceManger.NotificationService.MarkAllAsReadAsync(userId);

            return Ok(result);
        }
    }
}
