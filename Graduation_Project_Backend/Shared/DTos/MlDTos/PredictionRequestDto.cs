using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Shared.DTos.MlDTos
{
    public class PredictionRequestDto
    {
        [JsonPropertyName("Age")]
        public double? Age { get; set; }

        [JsonPropertyName("No_of_Pregnancy")]
        public double? NoOfPregnancy { get; set; }

        [JsonPropertyName("Gestation_in_previous_Pregnancy")]
        public double? GestationInPreviousPregnancy { get; set; }

        [JsonPropertyName("BMI")]
        public double? BMI { get; set; }

        [JsonPropertyName("HDL")]
        public double? HDL { get; set; }

        [JsonPropertyName("Family_History")]
        public double? FamilyHistory { get; set; }

        [JsonPropertyName("unexplained_prenetal_loss")]
        public double? UnexplainedPrenetalLoss { get; set; }

        [JsonPropertyName("Large_Child_or_Birth_Default")]
        public double? LargeChildOrBirthDefault { get; set; }

        [JsonPropertyName("PCOS")]
        public double? PCOS { get; set; }

        [JsonPropertyName("Sys")]
        public double? Sys { get; set; }

        [JsonPropertyName("dia")]
        public double? Dia { get; set; }

        [JsonPropertyName("OGTT")]
        public double? OGTT { get; set; }

        [JsonPropertyName("Hemoglobin")]
        public double? Hemoglobin { get; set; }

        [JsonPropertyName("Sedentary_Lifestyle")]
        public double? SedentaryLifestyle { get; set; }

        [JsonPropertyName("Prediabetes")]
        public double? Prediabetes { get; set; }
    }
}
