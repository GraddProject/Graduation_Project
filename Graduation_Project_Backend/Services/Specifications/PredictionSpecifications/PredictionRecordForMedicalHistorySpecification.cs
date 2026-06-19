using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PredictionSpecifications
{
    class PredictionRecordForMedicalHistorySpecification : BaseSpecifications<PredictionRecord>
    {
        public PredictionRecordForMedicalHistorySpecification(
            int predictionRecordId,
            int doctorId,
            int patientId)
            : base(p =>
                p.Id == predictionRecordId &&
                p.DoctorId == doctorId &&
                p.PatientId == patientId)
        {
            AddInclude(p => p.MedicalHistory);
        }
    }
}
