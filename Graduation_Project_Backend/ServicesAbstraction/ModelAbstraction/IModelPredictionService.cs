using Shared.DTos.MlDTos;
using Shared.DTos.PredictionDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.ModelAbstraction
{
    public interface IModelPredictionService
    {
        Task<PredictionResponseDto> PredictAsync(PredictionRequestDto request);

        Task<SavedPredictionResponseDto> CreateGdmPredictionAsync(string email, CreateGdmPredictionDto request);

        Task<SavedPredictionResponseDto> CreatePreeclampsiaPredictionAsync(string email, CreatePreeclampsiaPredictionDto request);

        Task<IEnumerable<PredictionInsightDto>> GetDoctorPredictionInsightsAsync(string email);

        Task<PredictionDetailsDto> GetPredictionDetailsAsync(string email, int predictionRecordId);



        Task<IEnumerable<PredictionRiskDashboardDto>> GetPredictionRiskDashboardAsync(string email);


        Task<IEnumerable<PatientPredictionHistoryDto>> GetPatientPredictionHistoryAsync(string email, int patientId);
    }
}
