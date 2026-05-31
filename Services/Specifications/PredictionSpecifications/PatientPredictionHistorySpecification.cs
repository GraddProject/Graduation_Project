using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PredictionSpecifications
{
    class PatientPredictionHistorySpecification : BaseSpecifications<PredictionRecord>
    {
        public PatientPredictionHistorySpecification(int doctorId, int patientId)
            : base(p => p.DoctorId == doctorId && p.PatientId == patientId)
        {
            AddOrderByDescending(p => p.CreatedAt);
        }
    }
}
