using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class PreeclampsiaPredictionRequestDto
    {
        [JsonPropertyName("age")]
        public int Age { get; set; }

        [JsonPropertyName("parity")]
        public int Parity { get; set; }

        [JsonPropertyName("gravida")]
        public int Gravida { get; set; }

        [JsonPropertyName("bmi")]
        public decimal Bmi { get; set; }

        [JsonPropertyName("gestational_age_weeks")]
        public int GestationalAgeWeeks { get; set; }

        [JsonPropertyName("chronic_hypertension")]
        public int ChronicHypertension { get; set; }

        [JsonPropertyName("pregestational_diabetes")]
        public int PregestationalDiabetes { get; set; }

        [JsonPropertyName("chronic_kidney_disease")]
        public int ChronicKidneyDisease { get; set; }

        [JsonPropertyName("multiple_pregnancy")]
        public int MultiplePregnancy { get; set; }

        [JsonPropertyName("previous_preeclampsia")]
        public int PreviousPreeclampsia { get; set; }

        [JsonPropertyName("family_history_preeclampsia")]
        public int FamilyHistoryPreeclampsia { get; set; }

        [JsonPropertyName("antiphospholipid_syndrome")]
        public int AntiphospholipidSyndrome { get; set; }

        [JsonPropertyName("platelets_k_ul")]
        public decimal PlateletsKUl { get; set; }

        [JsonPropertyName("ast_u_l")]
        public decimal AstUL { get; set; }

        [JsonPropertyName("alt_u_l")]
        public decimal AltUL { get; set; }

        [JsonPropertyName("creatinine_mg_dl")]
        public decimal CreatinineMgDl { get; set; }

        [JsonPropertyName("ldh_u_l")]
        public decimal LdhUL { get; set; }

        [JsonPropertyName("uric_acid_mg_dl")]
        public decimal UricAcidMgDl { get; set; }

        [JsonPropertyName("hemoglobin_g_dl")]
        public decimal HemoglobinGDl { get; set; }

        [JsonPropertyName("headache")]
        public int Headache { get; set; }

        [JsonPropertyName("visual_disturbances")]
        public int VisualDisturbances { get; set; }

        [JsonPropertyName("epigastric_pain")]
        public int EpigastricPain { get; set; }

        [JsonPropertyName("edema")]
        public int Edema { get; set; }

        [JsonPropertyName("nausea_vomiting")]
        public int NauseaVomiting { get; set; }

        [JsonPropertyName("fetal_growth_restriction")]
        public int FetalGrowthRestriction { get; set; }

        [JsonPropertyName("acute_kidney_injury")]
        public int AcuteKidneyInjury { get; set; }

        [JsonPropertyName("pulmonary_edema")]
        public int PulmonaryEdema { get; set; }
    }
}
