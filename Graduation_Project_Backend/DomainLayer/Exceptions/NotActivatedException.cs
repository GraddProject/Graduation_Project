using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class NotActivatedException(string Message = "Your account is not activated. Please check your email for the activation link.") : Exception(Message)
    {
    }
}
