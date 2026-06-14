using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class MedicalData
    {
        public DateOnly? DateOfBirth { get; set; }
        public int? Age { get; set; }

        public string? BloodType { get; set; } = default!;
        [Display(Name = "Height", Description = "Height in centimeters.")]
        public int? Height { get; set; }


        [Display(Name = "Weight", Description = "Weight in kilograms.")]
        public int? Weight { get; set; }
        public decimal? BMI { get; set; }

        public DateOnly? PregnancyStartDate { get; set; }
        public int? PregnancyWeek { get; set; }
        public int? NumberOfPregnancies { get; set; }

        [Display(
           Name = "Previous Gestational Diabetes",
           Description = "Indicates whether the patient was diagnosed with gestational diabetes in a previous pregnancy.")]
        public bool? HadGestationalDiabetesBefore { get; set; }


        [Display(
            Name = "Family History of Diabetes",
            Description = "Indicates whether the patient has a family history of diabetes, such as parents or siblings.")]
        public bool? HasFamilyHistoryOfDiabetes { get; set; }


        [Display(
            Name = "Unexplained Prenatal Loss",
            Description = "Indicates whether the patient had a previous pregnancy loss without a clear medical reason.")]
        public bool? HadUnexplainedPrenatalLoss { get; set; }


        [Display(
            Name = "Large Child or Birth Default",
            Description = "Indicates whether the patient previously delivered a large baby or had a birth-related abnormality.")]
        public bool? HadLargeChildOrBirthDefault { get; set; }


        [Display(
            Name = "PCOS",
            Description = "Indicates whether the patient has been diagnosed with polycystic ovary syndrome.")]
        public bool? HasPCOS { get; set; }


        [Display(
            Name = "Sedentary Lifestyle",
            Description = "Indicates whether the patient has a low-activity lifestyle or does not exercise regularly.")]
        public bool? HasSedentaryLifestyle { get; set; }


        [Display(
            Name = "Prediabetes",
            Description = "Indicates whether the patient has been diagnosed with prediabetes or high blood sugar before diabetes.")]
        public bool? HasPrediabetes { get; set; }


        // Preeclampsia

        [Display(
            Name = "Gravida",
            Description = "Total number of pregnancies, including the current pregnancy.")]
        public int? Gravida { get; set; }


        [Display(
            Name = "Parity",
            Description = "Number of previous pregnancies that reached a viable birth stage.")]
        public int? Parity { get; set; }


        [Display(
            Name = "Chronic Hypertension",
            Description = "Indicates whether the patient has chronic high blood pressure before pregnancy or early in pregnancy.")]
        public bool? HasChronicHypertension { get; set; }


        [Display(
            Name = "Pregestational Diabetes",
            Description = "Indicates whether the patient had diabetes before becoming pregnant.")]
        public bool? HasPregestationalDiabetes { get; set; }


        [Display(
            Name = "Chronic Kidney Disease",
            Description = "Indicates whether the patient has chronic kidney disease.")]
        public bool? HasChronicKidneyDisease { get; set; }


        [Display(
            Name = "Previous Preeclampsia",
            Description = "Indicates whether the patient was diagnosed with preeclampsia in a previous pregnancy.")]
        public bool? HadPreviousPreeclampsia { get; set; }


        [Display(
            Name = "Family History of Preeclampsia",
            Description = "Indicates whether the patient has a family history of preeclampsia, such as mother or sister.")]
        public bool? HasFamilyHistoryOfPreeclampsia { get; set; }
    }
}
