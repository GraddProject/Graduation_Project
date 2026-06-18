using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PredictionSpecifications
{
    class DoctorPatientCardsPredictionsSpecification : BaseSpecifications<PredictionRecord>
    {
        public DoctorPatientCardsPredictionsSpecification(int doctorId)
            : base(p => p.DoctorId == doctorId)
        {
        }
    }
}
