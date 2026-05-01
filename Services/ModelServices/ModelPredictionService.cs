using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Services.Specifications.DoctorSpecifications;
using Services.Specifications.PatientSpecifications;
using Services.Specifications.PredictionSpecifications;
using ServicesAbstraction.ModelAbstraction;
using Shared.DTos.MlDTos;
using Shared.DTos.PredictionDTos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Services.ModelServices
{
    public class ModelPredictionService : IModelPredictionService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public ModelPredictionService(HttpClient httpClient, IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _unitOfWork = unitOfWork;
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

        public async Task<SavedPredictionResponseDto> CreateGdmPredictionAsync(string email,CreateGdmPredictionDto request)
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

            return predictions.Select(p => new PredictionInsightDto
            {
                PredictionRecordId = p.Id,
                PatientName = p.Patient.User.DisplayName,
                MedicalHistoryId = p.MedicalHistory?.Id,
                Type = p.Type.ToString(),
                Date = p.CreatedAt.ToString("MMM dd, yyyy", CultureInfo.InvariantCulture),
                Result = GetRiskLevel(p.Confidence),
                Confidence = p.Confidence
            });
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
                Type = prediction.Type.ToString(),
                Date = prediction.CreatedAt.ToString("MMM dd, yyyy", CultureInfo.InvariantCulture),
                Result = GetRiskLevel(prediction.Confidence),
                Confidence = prediction.Confidence,
                InputJson = prediction.InputJson,
                RawResponseJson = prediction.RawResponseJson
            };
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
    }
}
