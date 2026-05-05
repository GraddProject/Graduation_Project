using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class PatientsBelongToSpecifcDoctor : BaseSpecifications<Patient>
    {
        public PatientsBelongToSpecifcDoctor(int doctorId) : base(P => P.DoctorID == doctorId)
        {
            AddInclude(p => p.User);
        }


        public PatientsBelongToSpecifcDoctor(int patientId, int doctorId)
        : base(p => p.Id == patientId && p.DoctorID == doctorId)
        {
            AddInclude(p => p.User);
            AddInclude(p => p.MedicalHistory);

        }
    }
}
