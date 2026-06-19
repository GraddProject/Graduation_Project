using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class UserIdNotFoundException(string UserId) : NotFoundException($"User With Id : {UserId} Is Not Found")
    {
    }
}
