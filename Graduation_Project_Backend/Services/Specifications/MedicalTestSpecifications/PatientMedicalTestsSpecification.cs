using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.MedicalTestSpecifications
{
    class PatientMedicalTestsSpecification :BaseSpecifications<MedicalTest>
    {

        public PatientMedicalTestsSpecification(int patientId)
            : base(m => m.PatientId == patientId)
        {
        }

        public PatientMedicalTestsSpecification(int patientId, int medicalTestId)
            : base(m => m.PatientId == patientId && m.Id == medicalTestId)
        {
        }
    }
}
