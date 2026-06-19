export const normalizeMedicalData = (data) => {
  if (!data) return {};

  return {
    // basic info
    age: data.age ?? "",
    bmi: data.bmi ?? "",
    height: data.height ?? "",
    weight: data.weight ?? "",
    pregnancyWeek: data.pregnancyWeek ?? "",
    bloodType: data.bloodType ?? "",

    // pregnancy structure
    numberOfPregnancies: data.numberOfPregnancies ?? "",
    gravida: data.gravida ?? "",
    parity: data.parity ?? "",

    // GDM / general risks (booleans → UI)
    hadGestationalDiabetesBefore: data.hadGestationalDiabetesBefore ?? false,
    hasFamilyHistoryOfDiabetes: data.hasFamilyHistoryOfDiabetes ?? false,
    hadUnexplainedPrenatalLoss: data.hadUnexplainedPrenatalLoss ?? false,
    hadLargeChildOrBirthDefault: data.hadLargeChildOrBirthDefault ?? false,
    hasPCOS: data.hasPCOS ?? false,
    hasSedentaryLifestyle: data.hasSedentaryLifestyle ?? false,
    hasPrediabetes: data.hasPrediabetes ?? false,

    // PE risk (booleans)
    hasChronicHypertension: data.hasChronicHypertension ?? false,
    hasPregestationalDiabetes: data.hasPregestationalDiabetes ?? false,
    hasChronicKidneyDisease: data.hasChronicKidneyDisease ?? false,
    hadPreviousPreeclampsia: data.hadPreviousPreeclampsia ?? false,
    hasFamilyHistoryOfPreeclampsia: data.hasFamilyHistoryOfPreeclampsia ?? false,
  };
};


export const toBinary = (value) => (value ? 1 : 0);

export const mapMedicalDataToPEModel = (data) => {
  if (!data) return {};

  return {
    age: data.age ?? "",
    parity: data.parity ?? "",
    gravida: data.gravida ?? "",
    bmi: data.bmi ?? "",
    gestational_age_weeks: data.pregnancyWeek ?? "",

    chronic_hypertension: toBinary(data.hasChronicHypertension),
    pregestational_diabetes: toBinary(data.hasPregestationalDiabetes),
    chronic_kidney_disease: toBinary(data.hasChronicKidneyDisease),
    previous_preeclampsia: toBinary(data.hadPreviousPreeclampsia),
    family_history_preeclampsia: toBinary(data.hasFamilyHistoryOfPreeclampsia),

    multiple_pregnancy: 0,
    antiphospholipid_syndrome: 0,

    headache: 0,
    visual_disturbances: 0,
    epigastric_pain: 0,
    edema: 0,
    nausea_vomiting: 0,

    fetal_growth_restriction: 0,
    acute_kidney_injury: 0,
    pulmonary_edema: 0,
  };
};

export const mapMedicalDataToGDMModel = (data) => {
  if (!data) return {};

  return {
    Age: data.age ?? "",
    BMI: data.bmi ?? "",
    No_of_Pregnancy: data.numberOfPregnancies ?? "",

    Family_History: toBinary(data.hasFamilyHistoryOfDiabetes),
    unexplained_prenetal_loss: toBinary(data.hadUnexplainedPrenatalLoss),
    Large_Child_or_Birth_Default: toBinary(data.hadLargeChildOrBirthDefault),
    PCOS: toBinary(data.hasPCOS),
    Sedentary_Lifestyle: toBinary(data.hasSedentaryLifestyle),
    Prediabetes: toBinary(data.hasPrediabetes),

    // placeholders لو مش موجودة في medical-data
    Gestation_in_previous_Pregnancy: 0,
    HDL: 0,
    Sys: 0,
    dia: 0,
    OGTT: 0,
    Hemoglobin: 0,
  };
};


