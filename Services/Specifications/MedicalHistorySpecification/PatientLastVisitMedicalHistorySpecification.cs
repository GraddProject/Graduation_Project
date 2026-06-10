using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.MedicalHistorySpecification
{
    class PatientLastVisitMedicalHistorySpecification : BaseSpecifications<MedicalHistory>
    {
        public PatientLastVisitMedicalHistorySpecification(
            int patientId,
            int doctorId,
            DateTime dayStart,
            DateTime dayEnd)
            : base(h =>
                h.PatientId == patientId &&
                h.CreatedByDoctorId == doctorId &&
                h.CreatedAt >= dayStart &&
                h.CreatedAt < dayEnd)
        {
            AddInclude(h => h.CreatedByDoctor);
            AddInclude(h => h.CreatedByDoctor.User);

            AddOrderByDescending(h => h.CreatedAt);
        }
    }
}
