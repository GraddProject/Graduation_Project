using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.NotificationSpecifications
{
    class UserNotificationByIdSpecification : BaseSpecifications<Notification>
    {
        public UserNotificationByIdSpecification(string userId, int notificationId) 
            :base(N => N.UserId == userId && N.Id == notificationId)
        {
        }
    }
}
