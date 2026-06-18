using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class DoctorPatientsCardsSpecification : BaseSpecifications<Patient>
    {
        public DoctorPatientsCardsSpecification(int doctorId)
            : base(p => p.DoctorID == doctorId)
        {
            AddInclude(p => p.User);
        }
    }
}
