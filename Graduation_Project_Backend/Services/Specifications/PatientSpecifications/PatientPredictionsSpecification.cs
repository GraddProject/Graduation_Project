using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class PatientPredictionsSpecification : BaseSpecifications<PredictionRecord>
    {
        public PatientPredictionsSpecification(int patientId)
            : base(p => p.PatientId == patientId)
        {
        }
    }
}
