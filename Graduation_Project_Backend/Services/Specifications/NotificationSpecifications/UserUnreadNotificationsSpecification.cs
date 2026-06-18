using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.NotificationSpecifications
{
    class UserUnreadNotificationsSpecification : BaseSpecifications<Notification>
    {
        public UserUnreadNotificationsSpecification(string userId) : base(N => N.UserId == userId && !N.IsRead)
        {
        }
    }
}
