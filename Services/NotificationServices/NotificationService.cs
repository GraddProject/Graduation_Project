using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using Services.Specifications.NotificationSpecifications;
using ServicesAbstraction.NotificationAbstraction;
using Shared.DTos.NotificationDTos;
using Shared.ErrorModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.NotificationServices
{
    public class NotificationService(
        IUnitOfWork _unitOfWork,
        INotificationSender _notificationSender) : INotificationService
    {
        public async Task<NotificationDto> CreateAndSendAsync(string userId, string title, string message, NotificationTypeDto type, string? relatedEntityType = null, int? relatedEntityId = null)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new BadRequestException("Notification user id is required.");

            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = (NotificationType)type,
                //AppointmentId = appointmentId,
                RelatedEntityType = relatedEntityType,
                RelatedEntityId = relatedEntityId,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            await _unitOfWork.GetRepository<Notification>().AddAsync(notification);
            await _unitOfWork.SaveChangesAsync();

            var dto = MapNotificationToDto(notification);

            try
            {
                await _notificationSender.SendToUserAsync(userId, dto);
            }
            catch
            {
                // Notification is already saved in database.
                // Do not break the main business flow if real-time sending fails.
            }

            return dto;
        }

        public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var notifications = await _unitOfWork
                .GetRepository<Notification>()
                .GetAllAsync(new UserNotificationsSpecification(userId));

            return notifications.Select(MapNotificationToDto);
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            return await _unitOfWork
                .GetRepository<Notification>()
                .CountAsync(new UserUnreadNotificationsSpecification(userId));
        }

        public async Task<ServiceResponse> MarkAsReadAsync(string userId, int notificationId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var repo = _unitOfWork.GetRepository<Notification>();

            var notification = await repo.GetByIdAsync(
                new UserNotificationByIdSpecification(userId, notificationId));

            if (notification is null)
                throw new BadRequestException("Notification not found.");

            notification.IsRead = true;

            repo.Update(notification);
            await _unitOfWork.SaveChangesAsync();

            return new ServiceResponse
            {
                Status = true,
                Message = "Notification marked as read."
            };
        }

        public async Task<ServiceResponse> MarkAllAsReadAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var repo = _unitOfWork.GetRepository<Notification>();

            var notifications = await repo.GetAllAsync(
                new UserUnreadNotificationsSpecification(userId));

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                repo.Update(notification);
            }

            await _unitOfWork.SaveChangesAsync();

            return new ServiceResponse
            {
                Status = true,
                Message = "All notifications marked as read."
            };
        }

        private static NotificationDto MapNotificationToDto(Notification notification)
        {
            return new NotificationDto
            {
                Id = notification.Id,
                Title = notification.Title,
                Message = notification.Message,
                Type = notification.Type.ToString(),
                IsRead = notification.IsRead,
                //AppointmentId = notification.AppointmentId,
                RelatedEntityType = notification.RelatedEntityType,
                RelatedEntityId = notification.RelatedEntityId,
                CreatedAt = notification.CreatedAt
            };
        }
    }
}
