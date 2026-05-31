using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using Microsoft.Extensions.Configuration;
using Services.Specifications.PatientSpecifications;
using Services.Specifications.PredictionSpecifications;
using ServicesAbstraction.Common;
using ServicesAbstraction.ModelAbstraction;
using Shared.DTos.MlDTos;
using Shared.DTos.PredictionDTos;
using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

namespace Services.ModelServices
{
    public class ModelPredictionService : IModelPredictionService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorageService _fileStorageService;

        public ModelPredictionService(HttpClient httpClient, IConfiguration configuration, IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _unitOfWork = unitOfWork;
            _fileStorageService = fileStorageService;
        }
        public async Task<PredictionResponseDto> PredictAsync(PredictionRequestDto request)
        {
            var modelCall = await PredictInternalAsync(request);

            return modelCall.Result;
        }

        private async Task<(PredictionResponseDto Result, string RawResponseJson)> PredictInternalAsync(PredictionRequestDto request)
        {
            var endpoint = _configuration["ModelApi:PredictEndpoint"] ?? "predict";

            using var response = await _httpClient.PostAsJsonAsync(endpoint, request);

            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Model API failed. StatusCode: {(int)response.StatusCode}, Body: {responseBody}");

            var modelApiResult = JsonSerializer.Deserialize<ModelApiPredictionResponseDto>(
                responseBody,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (modelApiResult is null)
                throw new Exception("Invalid response returned from model API.");

            if (string.IsNullOrWhiteSpace(modelApiResult.Label))
                throw new Exception($"Model API returned empty label. Body: {responseBody}");

            var result = new PredictionResponseDto
            {
                Result = modelApiResult.Label,
                Confidence = modelApiResult.Probability
            };

            return (result, responseBody);
        }

        public async Task<SavedPredictionResponseDto> CreateGdmPredictionAsync(string email, CreateGdmPredictionDto request)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (request is null)
                throw new BadRequestException("Prediction request is required.");

            if (request.PatientId <= 0)
                throw new BadRequestException("PatientId is required.");

            if (request.Data is null)
                throw new BadRequestException("Prediction data is required.");

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await patientRepo.GetByIdAsync(
                new PatientsBelongToSpecifcDoctor(request.PatientId, doctor.Id));

            if (patient is null)
                throw new BadRequestException("Patient not found or does not belong to this doctor.");

            var modelCall = await PredictInternalAsync(request.Data);

            var modelResult = modelCall.Result;

            var confidence = NormalizeConfidence(modelResult.Confidence);

            var inputJson = JsonSerializer.Serialize(request.Data);

            var predictionRecord = new PredictionRecord
            {
                PatientId = patient.Id,
                DoctorId = doctor.Id,
                Type = PredictionType.GDM,
                Result = modelResult.Result,
                Confidence = confidence,
                InputJson = inputJson,
                RawResponseJson = modelCall.RawResponseJson,
                CreatedAt = DateTime.Now
            };

            await predictionRepo.AddAsync(predictionRecord);

            var saved = await _unitOfWork.SaveChangesAsync();

            if (saved <= 0)
                throw new BadRequestException("Failed to save prediction result.");

            return new SavedPredictionResponseDto
            {
                PredictionRecordId = predictionRecord.Id,
                PatientId = patient.Id,
                Type = PredictionType.GDM.ToString(),
                Result = predictionRecord.Result,
                Confidence = predictionRecord.Confidence,
                CreatedAt = predictionRecord.CreatedAt
            };
        }


        public async Task<IEnumerable<PredictionInsightDto>> GetDoctorPredictionInsightsAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var predictions = await predictionRepo.GetAllAsync(
                new DoctorPredictionsSpecification(doctor.Id));

            var data = predictions.Select(async p => new PredictionInsightDto
            {
                PredictionRecordId = p.Id,
                PatientName = p.Patient.User.DisplayName,

                ProfileImageUrl = await _fileStorageService.GenerateReadUrlAsync(p.Patient.User.ProfileImagePath, TimeSpan.FromHours(12)),

                MedicalHistoryId = p.MedicalHistory?.Id,
                Type = p.Type.ToString(),
                Date = p.CreatedAt.ToString("MMM dd, yyyy", CultureInfo.InvariantCulture),
                Result = GetRiskLevel(p.Confidence),
                Confidence = p.Confidence
            });

            return await Task.WhenAll(data);
        }





        public async Task<PredictionDetailsDto> GetPredictionDetailsAsync(string email, int predictionRecordId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (predictionRecordId <= 0)
                throw new BadRequestException("Prediction record id is required.");

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var prediction = await predictionRepo.GetByIdAsync(
                new DoctorPredictionDetailsSpecification(doctor.Id, predictionRecordId));

            if (prediction is null)
                throw new BadRequestException("Prediction record not found.");

            return new PredictionDetailsDto
            {
                PredictionRecordId = prediction.Id,
                PatientName = prediction.Patient.User.DisplayName,
                ProfileImageUrl = await _fileStorageService.GenerateReadUrlAsync(prediction.Patient.User.ProfileImagePath, TimeSpan.FromHours(12)),
                Type = prediction.Type.ToString(),
                Date = prediction.CreatedAt.ToString("MMM dd, yyyy", CultureInfo.InvariantCulture),
                Result = GetRiskLevel(prediction.Confidence),
                Confidence = prediction.Confidence,
                InputJson = prediction.InputJson,
                RawResponseJson = prediction.RawResponseJson
            };
        }



        public async Task<IEnumerable<PredictionRiskDashboardDto>> GetPredictionRiskDashboardAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var predictions = await predictionRepo.GetAllAsync(
                new DoctorPredictionsSpecification(doctor.Id));

            var latestPredictionPerPatientPerType = predictions
                .GroupBy(p => new { p.PatientId, p.Type })
                .Select(g => g
                    .OrderByDescending(p => p.CreatedAt)
                    .ThenByDescending(p => p.Id)
                    .First())
                .ToList();

            return new List<PredictionRiskDashboardDto>
            {
                BuildRiskDashboardCard(
                    PredictionType.GDM,
                    "GDM Risk Level",
                    latestPredictionPerPatientPerType),

                BuildRiskDashboardCard(
                    PredictionType.Preeclampsia,
                    "Preeclampsia Risk Level",
                    latestPredictionPerPatientPerType)
            };
        }



        public async Task<IEnumerable<PatientPredictionHistoryDto>> GetPatientPredictionHistoryAsync(string email, int patientId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (patientId <= 0)
                throw new BadRequestException("Patient id is required.");

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await patientRepo.GetByIdAsync(
                new PatientsBelongToSpecifcDoctor(patientId, doctor.Id));

            if (patient is null)
                throw PatientNotFoundException.Belong(
                    "Patient not found or does not belong to this doctor.");

            var predictions = await predictionRepo.GetAllAsync(
                new PatientPredictionHistorySpecification(doctor.Id, patientId));

            return predictions.Select(p => new PatientPredictionHistoryDto
            {
                PredictionRecordId = p.Id,

                Month = p.CreatedAt.ToString("MMM", CultureInfo.InvariantCulture).ToUpper(),
                Day = p.CreatedAt.Day,
                CreatedAt = p.CreatedAt,

                Type = p.Type.ToString(),
                RiskLevel = GetRiskLevel(p.Confidence),

                Confidence = p.Confidence,

                MedicalHistoryId = p.MedicalHistory?.Id
            });
        }



        private static decimal NormalizeConfidence(decimal confidence)
        {
            return confidence <= 1
                ? Math.Round(confidence * 100, 2)
                : Math.Round(confidence, 2);
        }

        private static string GetRiskLevel(decimal confidence)
        {
            if (confidence >= 75)
                return "High Risk";

            if (confidence >= 50)
                return "Medium Risk";

            return "Low Risk";
        }


        private static PredictionRiskDashboardDto BuildRiskDashboardCard(PredictionType type, string title, IEnumerable<PredictionRecord> predictions)
        {
            var typePredictions = predictions
                .Where(p => p.Type == type)
                .ToList();

            return new PredictionRiskDashboardDto
            {
                Type = type.ToString(),
                Title = title,

                TotalPatients = typePredictions.Count,

                HighLevelPatients = typePredictions.Count(p => p.Confidence >= 75),

                ModerateLevelPatients = typePredictions.Count(p =>
                    p.Confidence >= 50 && p.Confidence < 75),

                LowLevelPatients = typePredictions.Count(p => p.Confidence < 50)
            };
        }

    }
}
