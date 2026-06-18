using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.AppointmentSpecifications
{
    class PatientByEmailForAppointmentSpecification : BaseSpecifications<Patient>
    {
        public PatientByEmailForAppointmentSpecification(string email):base(p => p.User.Email == email)
        {
            AddInclude(p => p.User);
            AddInclude(p => p.Doctor);
        }
    }
}
