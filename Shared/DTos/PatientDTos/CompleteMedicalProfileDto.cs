using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PatientDTos
{
    public class CompleteMedicalProfileDto
    {
        public IFormFile? ProfileImage { get; set; }
        public DateOnly? DateOfBirth { get; set; }

        public DateOnly? PregnancyStartDate { get; set; }

        public string? BloodType { get; set; } = default!;

        public int? Height { get; set; }

        public int? Weight { get; set; }

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
