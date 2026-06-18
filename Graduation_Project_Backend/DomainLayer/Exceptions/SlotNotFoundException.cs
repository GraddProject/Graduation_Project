using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class SlotNotFoundException : NotFoundException
    {
        public SlotNotFoundException(int Id) : base($"Slot With ID : {Id} Is Not Found")
        {
        }
    }
}
