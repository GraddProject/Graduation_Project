using DomainLayer.Models;
using Shared.DTos.MedicalHistoryDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.MedicalHistorySpecification
{
    class PatientMedicalHistoriesSpecification : BaseSpecifications<MedicalHistory>
    {
        public PatientMedicalHistoriesSpecification(int patientId) : base(M => M.PatientId == patientId)
        {
            AddInclude(M => M.PreScriptions);
        }

        public PatientMedicalHistoriesSpecification(int patientId, int medicalhistoryId) :
            base(M => M.PatientId == patientId && M.Id == medicalhistoryId)
        {
            AddInclude(M => M.PreScriptions);
        }


        public PatientMedicalHistoriesSpecification(int patientId, bool? hasPrediction, PatientMedicalHistorySort sort)
            : base(mh =>
                mh.PatientId == patientId &&
                (
                    !hasPrediction.HasValue ||
                    (hasPrediction.Value
                        ? mh.PredictionRecordId.HasValue
                        : !mh.PredictionRecordId.HasValue)
                ))
        {
            AddInclude(mh => mh.PreScriptions);
            AddInclude(mh => mh.PredictionRecord);
            AddInclude(mh => mh.CreatedByDoctor);
            AddInclude(mh => mh.CreatedByDoctor.User);

            if (sort == PatientMedicalHistorySort.Oldest)
                AddOrderBy(mh => mh.CreatedAt);
            else
                AddOrderByDescending(mh => mh.CreatedAt);
        }
    }
}
