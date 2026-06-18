using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class PrescriptionNotFoundException : NotFoundException
    {
        public PrescriptionNotFoundException(int Id) : base($"Prescription With Id : {Id} Is Not Found")
        {
        }
    }
}
