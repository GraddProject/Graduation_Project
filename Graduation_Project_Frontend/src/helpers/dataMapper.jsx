export const normalizeMedicalData = (data) => {
  if (!data) return {};

  return {
    Age: data.age ?? "",
    BMI: data.bmi ?? "",
    Height: data.height ?? "",
    Weight: data.weight ?? "",
    PregnancyWeek: data.pregnancyWeek ?? "",

    NumberOfPregnancies: data.numberOfPregnancies ?? "",
    Parity: data.parity ?? "",
    Gravida: data.gravida ?? "",

    HadGestationalDiabetesBefore: !!data.HadGestationalDiabetesBefore,
    HasPrediabetes: !!data.HasPrediabetes,
    HasPCOS: !!data.HasPCOS,
    HasFamilyHistoryOfDiabetes: !!data.HasFamilyHistoryOfDiabetes,
    HasSedentaryLifestyle: !!data.HasSedentaryLifestyle,
    HadUnexplainedPrenatalLoss: !!data.HadUnexplainedPrenatalLoss,
    HadLargeChildOrBirthDefault: !!data.HadLargeChildOrBirthDefault,

    HasChronicHypertension: !!data.HasChronicHypertension,
    HasChronicKidneyDisease: !!data.HasChronicKidneyDisease,
    HasPregestationalDiabetes: !!data.HasPregestationalDiabetes,
    HadPreviousPreeclampsia: !!data.HadPreviousPreeclampsia,
    HasFamilyHistoryOfPreeclampsia: !!data.HasFamilyHistoryOfPreeclampsia,

    BloodType: data.bloodType ?? "",
  };
};