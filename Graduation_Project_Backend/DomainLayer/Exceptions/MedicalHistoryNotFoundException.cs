using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class MedicalHistoryNotFoundException : NotFoundException
    {
        public MedicalHistoryNotFoundException(int Id) : base($"Medical History With Id : {Id} Is Not Found")
        {
        }
    }
}
