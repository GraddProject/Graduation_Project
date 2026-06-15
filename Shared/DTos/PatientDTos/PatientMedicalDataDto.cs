using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PatientDTos
{
    public class PatientMedicalDataDto
    {
        public int PatientId { get; set; }
        public int? Age { get; set; }
        public string? BloodType { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public decimal? BMI { get; set; }
        public int? PregnancyWeek { get; set; }
        public int? NumberOfPregnancies { get; set; }
        
        // GDM
        public bool? HadGestationalDiabetesBefore { get; set; }
        public bool? HasFamilyHistoryOfDiabetes { get; set; }
        public bool? HadUnexplainedPrenatalLoss { get; set; }
        public bool? HadLargeChildOrBirthDefault { get; set; }
        public bool? HasPCOS { get; set; }
        public bool? HasSedentaryLifestyle { get; set; }
        public bool? HasPrediabetes { get; set; }

        // Preeclampsia
        public int? Gravida { get; set; }
        public int? Parity { get; set; }
        public bool? HasChronicHypertension { get; set; }
        public bool? HasPregestationalDiabetes { get; set; }
        public bool? HasChronicKidneyDisease { get; set; }
        public bool? HadPreviousPreeclampsia { get; set; }
        public bool? HasFamilyHistoryOfPreeclampsia { get; set; }
    }
}
