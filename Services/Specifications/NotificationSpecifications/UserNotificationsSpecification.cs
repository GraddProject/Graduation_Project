using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.NotificationSpecifications
{
    class UserNotificationsSpecification : BaseSpecifications<Notification>
    {
        public UserNotificationsSpecification(string userId) :base(N=>N.UserId==userId)
        {
            AddOrderByDescending(N => N.CreatedAt);
        }
    }
}
