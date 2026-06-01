using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.MedicalHistoryDTos
{

    public class PatientMedicalHistoryQueryParams
    {
        public bool? HasPrediction { get; set; }
        public PatientMedicalHistorySort Sort { get; set; } = PatientMedicalHistorySort.Newest;
    }

    public enum PatientMedicalHistorySort
    {
        Newest = 0,
        Oldest = 1
    }

    public class PatientMedicalHistoryMonthGroupDto
    {
        public string Month { get; set; } = default!;
        public IEnumerable<PatientMedicalHistoryTimelineItemDto> Items { get; set; } = [];
    }

    public class PatientMedicalHistoryTimelineItemDto
    {
        public int MedicalHistoryId { get; set; }

        public string Diagnosis { get; set; } = default!;
        public string? VitalSigns { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Date { get; set; } = default!;
        public string Time { get; set; } = default!;

        //public string? DoctorName { get; set; }

        public bool HasPrediction { get; set; }
        public PatientMedicalHistoryPredictionDto? Prediction { get; set; }

        public IEnumerable<PatientMedicalHistoryPrescriptionDto> Prescriptions { get; set; } = [];
    }

    public class PatientMedicalHistoryPredictionDto
    {
        public int PredictionRecordId { get; set; }

        public string Type { get; set; } = default!;
        public string Result { get; set; } = default!;

        public string RiskLevel { get; set; } = default!;
        public decimal ConfidencePercentage { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public class PatientMedicalHistoryPrescriptionDto
    {
        public int PrescriptionId { get; set; }

        public string MedicationName { get; set; } = default!;
        public string Dosage { get; set; } = default!;
        public string Duration { get; set; } = default!;
        public string Instructions { get; set; } = default!;

        public DateTime CreatedAt { get; set; }
    }
}
