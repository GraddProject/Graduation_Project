using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class PatientNotFoundException : NotFoundException
    {
        public PatientNotFoundException(int id)
            : base($"Patient With Id: {id} Is Not Found")
        {
        }

        public PatientNotFoundException(string userId)
            : base($"Patient With User Id: {userId} Is Not Found")
        {
        }

        private PatientNotFoundException(string message, bool _)
             : base(message)
        {
        }

        public static PatientNotFoundException Belong(string message)
            => new PatientNotFoundException(message, true);
    }
}
