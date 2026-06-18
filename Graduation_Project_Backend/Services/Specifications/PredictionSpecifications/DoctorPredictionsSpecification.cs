using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PredictionSpecifications
{
    class DoctorPredictionsSpecification : BaseSpecifications<PredictionRecord>
    {
        public DoctorPredictionsSpecification(int doctorId) 
            : base(P => P.DoctorId == doctorId)
        {
            AddInclude(P => P.Patient);
            AddInclude(P => P.Patient.User);
            AddInclude(p => p.MedicalHistory);

            AddOrderByDescending(P => P.CreatedAt);
        }
    }
}
