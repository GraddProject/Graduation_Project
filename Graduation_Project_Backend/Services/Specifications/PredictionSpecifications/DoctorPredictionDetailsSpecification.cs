using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PredictionSpecifications
{
    class DoctorPredictionDetailsSpecification : BaseSpecifications<PredictionRecord>
    {
        public DoctorPredictionDetailsSpecification(int doctorId, int predictionRecordId)
            : base(p => p.DoctorId == doctorId && p.Id == predictionRecordId)
        {
            AddInclude(p => p.Patient);
            AddInclude(p => p.Patient.User);
        }
    }
}
