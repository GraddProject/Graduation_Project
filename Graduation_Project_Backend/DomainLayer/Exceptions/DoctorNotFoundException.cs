using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class DoctorNotFoundException : NotFoundException
    {
        public DoctorNotFoundException(int id) 
            : base($"Doctor With Id: {id} Is Not Found") 
        { 
        }
        
        public DoctorNotFoundException(string message) 
            : base(message) 
        { 
        }
    }
}
