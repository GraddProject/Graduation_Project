using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class PatientByIdSpecification : BaseSpecifications<Patient>
    {
        public PatientByIdSpecification(string userId) :base(P=>P.UserId == userId)
        {
            AddInclude(p => p.User);
        }
    }
}
