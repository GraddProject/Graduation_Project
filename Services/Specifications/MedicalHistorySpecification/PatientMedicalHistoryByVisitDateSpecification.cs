using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.MedicalHistorySpecification
{
    class PatientMedicalHistoryByVisitDateSpecification : BaseSpecifications<MedicalHistory>
    {
        public PatientMedicalHistoryByVisitDateSpecification(
            int patientId,
            int doctorId,
            DateTime visitDate)
            : base(h =>
                h.PatientId == patientId &&
                h.CreatedByDoctorId == doctorId &&
                h.CreatedAt >= visitDate.Date &&
                h.CreatedAt < visitDate.Date.AddDays(1))
        {
            AddOrderByDescending(h => h.CreatedAt);
        }
    }
}
