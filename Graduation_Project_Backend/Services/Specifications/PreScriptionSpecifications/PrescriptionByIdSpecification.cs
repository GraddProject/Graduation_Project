using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PreScriptionSpecifications
{
    class PrescriptionByIdSpecification : BaseSpecifications<PreScription>
    {
        public PrescriptionByIdSpecification(int patientId, int medicalHistoryId, int prescriptionId)
            : base(p =>
                p.Id == prescriptionId &&
                p.MedicalHistoryId == medicalHistoryId &&
                p.MedicalHistory.PatientId == patientId)
        {
            AddInclude(p => p.MedicalHistory);
        }
    }
}
