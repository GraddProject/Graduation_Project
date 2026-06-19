import React, { useState, useEffect } from 'react'
import { Bell, FileText, Leaf, HeartPulse, ChartColumn, List, Image, File, ChevronLeft, X} from "lucide-react";
import img from "../../assets/doctor.png";
import { Label } from 'recharts';
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../Components/context/User.context";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { MODES } from '../../helpers/medicalModes';
import { getInitials } from '../../helpers/getInitials';
import FilePreviewModal from '../../Components/FilePreviewModal/FilePreviewModal'
import PredictionMedicalTest from '../../Components/PredictionMedicalTest/PredictionMedicalTest';
import SelectPredictionType from '../../Components/SelectPredictionType/SelectPredictionType';
import PredictionResultCard from '../../Components/PredictionResultCard/PredictionResultCard'
import ClinicalDataPanel from '../../Components/ClinicalDataPanel/ClinicalDataPanel';
import PredictionHistoryPanel from '../../Components/PredictionHistoryPanel/PredictionHistoryPanel'
import { clinicalInputs, riskFields , preeclampsiaRiskFields , preeclampsiaInputs } from "../../helpers/clinicalConfig";
import { normalizeMedicalData } from "../../helpers/dataMapper";

import { formatDate } from 'date-fns';

export default function Prediction() {

  const getLevelFromConfidence = (confidence) => {
    const value = Number(confidence);

    if (value >= 70) return "high";
    if (value >= 50) return "medium";
    if (value > 0) return "low";
    return null;
  };

  const getLevelStyle = (level) => {
    switch (level) {
      case "low":
        return {
          text: "Low Risk",
          color: "#4A6B4E",
          bg: "#F4FBF4",
          border: "#4A6B4E33",
          progress: "#4A6B4E"
        };

      case "medium":
        return {
          text: "Medium Risk",
          color: "#DAA520",
          bg: "#DAA5201A",
          border: "#DAA52033",
          progress: "#DAA520"
        };

      case "high":
        return {
          text: "High Risk",
          color: "#D7263D",
          bg: "#FDEAEA",
          border: "#C9727233",
          progress: "#D7263D"
        };

      default:
        return {
          text: "No Result",
          color: "#999",
          bg: "#eee",
          border: "#ddd",
          progress: "#999"
        };
    }
  };

  const { token } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState("Prediction");

  const [offset, setOffset] = useState(0);
  const [age, setAge] = useState("");
const [bmi, setBmi] = useState("");
const [numPregnancies, setNumPregnancies] = useState("");
const [prevGestation, setPrevGestation] = useState("");
const [hdlCholesterol, setHdlCholesterol] = useState("");
const [hemoglobin, setHemoglobin] = useState("");
const [ogtt, setOgtt] = useState("");
const [systolicBp, setSystolicBp] = useState("");
const [diastolicBp, setDiastolicBp] = useState("");
const [parity, setParity] = useState("");
const [gravida, setGravida] = useState("");
const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState("");

const [platelets, setPlatelets] = useState("");
const [ast, setAst] = useState("");
const [alt, setAlt] = useState("");
const [creatinine, setCreatinine] = useState("");
const [ldh, setLdh] = useState("");
const [uricAcid, setUricAcid] = useState("");
const [peHemoglobin, setPeHemoglobin] = useState("");


const gdmValues = {
  age,
  bmi,
  numPregnancies,
  prevGestation,
  hdlCholesterol,
  ogtt,
  systolicBp,
  diastolicBp,
  hemoglobin
};
const peValues = {
  age,
  bmi,
  parity,
  gravida,
  gestational_age_weeks: gestationalAgeWeeks,
  platelets,
  ast,
  alt,
  creatinine,
  ldh,
  uricAcid,
  hemoglobin: peHemoglobin,
};

const gdmSetters = {
  age: setAge,
  bmi: setBmi,
  numPregnancies: setNumPregnancies,
  prevGestation: setPrevGestation,
  hdlCholesterol: setHdlCholesterol,
  ogtt: setOgtt,
  systolicBp: setSystolicBp,
  diastolicBp: setDiastolicBp,
};
const peSetters = {
  age: setAge,
  bmi: setBmi,
  parity: setParity,
  gravida: setGravida,
  gestational_age_weeks: setGestationalAgeWeeks,
  platelets: setPlatelets,
  ast: setAst,
  alt: setAlt,
  creatinine: setCreatinine,
  ldh: setLdh,
  uricAcid: setUricAcid,
  hemoglobin: setPeHemoglobin,
};

  const [predictionResult, setPredictionResult] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [medicalData, setMedicalData] = useState(null);

  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null);

  const [riskFactors, setRiskFactors] = useState({
    Family_History: 0,
    PCOS: 0,
    unexplained_prenetal_loss: 0,
    Large_Child_or_Birth_Default: 0,
    Sedentary_Lifestyle: 0,
    Prediabetes: 0
  });

  const [peRiskFactors, setPeRiskFactors] = useState({
  chronic_hypertension: 0,
  pregestational_diabetes: 0,
  chronic_kidney_disease: 0,
  multiple_pregnancy: 0,
  previous_preeclampsia: 0,
  family_history_preeclampsia: 0,

  headache: 0,
  visual_disturbances: 0,
  epigastric_pain: 0,
  edema: 0,
  nausea_vomiting: 0,

  fetal_growth_restriction: 0,
  acute_kidney_injury: 0,
  pulmonary_edema: 0,
});
 const [predType, setPredType] = useState("GDM");
  const [view, setView] = useState("list");
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    open: false,
    mode: null,
    patientId: null,
    predictionRecordId: null,
    patientInfo: null
  });
  const [showMedical, setShowMedical] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [predictionRecordId, setPredictionRecordId] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
 
  
  const getPatient = async () => {
    try {
      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GetPatientById",
        {
          params: { patientId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const patientData = data?.data || data || {};

      const formattedPatient = {
        id: patientData.patientId,
        name: patientData.displayName,
        week: patientData.pregnancyWeek,
        imageUrl: patientData.profileImageUrl
      };

      setPatient(formattedPatient);
      console.log(patientData);

    } catch (error) {
      console.error("Failed to fetch patient:", error);
      setPatient(null);
    }
  };

  const getLabTests = async () => {
    try {
      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GetPatientMedicalTests",
        {
          params: { patientId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = Array.isArray(data) ? data : [];

      const formattedTests = list.map((t) => ({
        id: t.id,
        name: t.fileName,
        uploadedAt: t.uploadedAt,
        type: "file",
      }));

      setTests(formattedTests);

    } catch (error) {
      console.error("Failed to fetch tests:", error);
      setTests([]);
    }
  };

  const handleOpenTest = async (medicalTestId) => {
    try {
      const response = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/ViewPatientMedicalTest",
        {
          params: {
            patientId: id,
            medicalTestId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(response.data);

      setPreviewFile({
        url: fileURL,
        type: response.data.type,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handelDownloadTest = async (medicalTestId, fileName) => {
    try {
      const response = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/DownloadPatientMedicalTest",
        {
          params: {
            patientId: id,
            medicalTestId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.data.type || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error);
    }
  };

  const handleGeneratePrediction = async () => {
    try {
      setLoading(true);

      const payload = {
        patientId: Number(id),
        data: {
          Age: Number(age),
          No_of_Pregnancy: Number(numPregnancies),
          Gestation_in_previous_Pregnancy: Number(prevGestation),
          BMI: Number(bmi),
          HDL: Number(hdlCholesterol),
          OGTT: Number(ogtt),
          Sys: Number(systolicBp),
          dia: Number(diastolicBp),
          Hemoglobin: Number(hemoglobin),
          ...riskFactors
        }
      };

      const { data } = await axios.post(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GDM",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Prediction Response", data);

      setPredictionResult(data);
setPredictionRecordId(data?.predictionRecordId ?? null);

      const newPrediction = {
  id: data.predictionRecordId,
  medicalHistoryId: null,
  patientName: patient.name,
  patientId: Number(id),
  patientImage: patient.imageUrl,
  predicationType: data.type,
  predicationDate: "Today",
  predicationResult: data.result,
  predicationConfidence: data.confidence,
};
console.log("Prediction Response", data);

setPredictions(prev => {
  const updated = [newPrediction, ...prev];
  console.log("UPDATED PREDICTIONS", updated);
  return updated;
});

    } catch (error) {
      console.log("Prediction Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleGeneratePreeclampsia = async () => {
  try {
    setLoading(true);

    const payload = {
      patientId: Number(id),
      data: {
        age: Number(age),
        parity: Number(numPregnancies),
        gravida: Number(prevGestation),
        bmi: Number(bmi),
        gestational_age_weeks: Number(gestationalAgeWeeks || 0),

        chronic_hypertension: Number(riskFactors.chronic_hypertension || 0),
        pregestational_diabetes: Number(riskFactors.pregestational_diabetes || 0),
        chronic_kidney_disease: Number(riskFactors.chronic_kidney_disease || 0),
        multiple_pregnancy: Number(riskFactors.multiple_pregnancy || 0),
        previous_preeclampsia: Number(riskFactors.previous_preeclampsia || 0),
        family_history_preeclampsia: Number(riskFactors.family_history_preeclampsia || 0),

        platelets_k_ul: Number(platelets || 0),
        ast_u_l: Number(ast || 0),
        alt_u_l: Number(alt || 0),
        creatinine_mg_dl: Number(creatinine || 0),
        ldh_u_l: Number(ldh || 0),
        uric_acid_mg_dl: Number(uricAcid || 0),
        hemoglobin_g_dl: Number(hemoglobin || 0),

        headache: Number(riskFactors.headache || 0),
        visual_disturbances: Number(riskFactors.visual_disturbances || 0),
        epigastric_pain: Number(riskFactors.epigastric_pain || 0),
        edema: Number(riskFactors.edema || 0),
        nausea_vomiting: Number(riskFactors.nausea_vomiting || 0),

        fetal_growth_restriction: Number(riskFactors.fetal_growth_restriction || 0),
        acute_kidney_injury: Number(riskFactors.acute_kidney_injury || 0),
        pulmonary_edema: Number(riskFactors.pulmonary_edema || 0),
      }
    };

    const { data } = await axios.post(
      "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/preeclampsia",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PE Prediction Response", data);

    setPredictionResult(data);
    setPredictionRecordId(data?.predictionRecordId ?? null);

    const newPrediction = {
      id: data.predictionRecordId,
      medicalHistoryId: null,
      patientName: patient.name,
      patientId: Number(id),
      patientImage: patient.imageUrl,
      predicationType: data.type,
      predicationDate: "Today",
      predicationResult: data.result,
      predicationConfidence: data.confidence,
    };

    setPredictions(prev => {
      const updated = [newPrediction, ...prev];
      console.log("UPDATED PE PREDICTIONS", updated);
      return updated;
    });

  } catch (error) {
    console.log("PE Prediction Error:", error);
  } finally {
    setLoading(false);
  }
};

  const getAllPredictions = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/PredictionsList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = Array.isArray(data) ? data : [];

      const patientPredictions = list.filter(
        (item) => item.patientName === patient?.name
      );

      const formattedPredictions = patientPredictions.map((predication) => ({
        id: predication.predictionRecordId,
        medicalHistoryId: predication.medicalHistoryId,
        patientName: predication.patientName,
        patientId: predication.patientId,
        patientImage: predication.profileImageUrl,
        predicationType: predication.type,
        predicationDate: predication.date,
        predicationResult: predication.result,
        predicationConfidence: predication.confidence,
      }));

      setPredictions(formattedPredictions);

      console.log(data);

    } catch (error) {
      console.error("Failed to fetch predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicalHistory = async (medicalId) => {
    try {
      await axios.delete(
        `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients/${id}/medical-histories/${medicalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPredictions(prev =>
        prev.filter(item => item.medicalHistoryId !== medicalId)
      );

      setSelectedMedicalHistoryId(null);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMedicine = async (medicalId, prescriptionId) => {
    try {
      await axios.delete(
        `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients/${id}/medical-histories/${medicalId}/prescriptions/${prescriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handelUpdateMedicalHistory = (updated) => {
    setPredictions(prev =>
      prev.map(item =>
        item.medicalHistoryId === updated.id
          ? {
              ...item,
              diagnosis: updated.diagnosis,
              vitalSigns: updated.vitalSigns,
              notes: updated.notes,
            }
          : item
      )
    );
  };

  const handelUpdatePrescription = (medicalId, updatedPrescriptions) => {
    console.log(medicalId, updatedPrescriptions);
  };

  const handleAddMedicalHistory = (newRecord) => {

  setPredictions(prev =>
    prev.map(pred =>
      pred.id === newRecord.predictionRecordId
        ? {
            ...pred,
            medicalHistoryId: newRecord.medicalId
          }
        : pred
    )
  );

};

const getMedicalData = async () => {
  try {
    const { data } = await axios.get(
      `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients/${id}/medical-data`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMedicalData(data);
    console.log("Medical Data:", data);

  } catch (error) {
    console.log("Medical Data Error:", error);
  }
};

  useEffect(() => {
    if (!token || !id) return;
    getPatient();
    getLabTests();
    getMedicalData();
  }, [id, token]);

  useEffect(() => {
    if (patient) {
      getAllPredictions();
    }
  }, [patient]);

 useEffect(() => {
  if (!medicalData) return;

  setAge(medicalData.age ?? "");
  setBmi(medicalData.bmi ?? "");
  setNumPregnancies(medicalData.numberOfPregnancies ?? "");
  setGestationalAgeWeeks(medicalData.pregnancyWeek ?? "");

  setParity(medicalData.parity ?? "");
  setGravida(medicalData.gravida ?? "");

}, [medicalData]);

useEffect(() => {
  if (!medicalData) return;

  setRiskFactors(prev => ({
    ...prev,

    Family_History: medicalData.hasFamilyHistoryOfDiabetes ? 1 : 0,
    PCOS: medicalData.hasPCOS ? 1 : 0,
    unexplained_prenetal_loss: medicalData.hadUnexplainedPrenatalLoss ? 1 : 0,
    Large_Child_or_Birth_Default: medicalData.hadLargeChildOrBirthDefault ? 1 : 0,
    Sedentary_Lifestyle: medicalData.hasSedentaryLifestyle ? 1 : 0,
    Prediabetes: medicalData.hasPrediabetes ? 1 : 0,
  }));
}, [medicalData]);

  const confidenceValue = Number(predictionResult?.confidence || 0);
  const level = getLevelFromConfidence(confidenceValue);
  const levelStyle = getLevelStyle(level);

  const visiblePredictions = showAll
    ? predictions
    : predictions.slice(0, 6);
  console.log("Current Predictions", predictions);

    const values = predType === "PE" ? peValues : gdmValues;
const setters = predType === "PE" ? peSetters : gdmSetters;
const riskFactorsState = predType === "PE" ? peRiskFactors : riskFactors;
const setRiskFactorsState = predType === "PE" ? setPeRiskFactors : setRiskFactors;
  return (
    <>
      <div className='w-full'>
        <div className="bg-[#F7F9F7FF] px-3 lg:px-8 py-1">

          {patient && (
            <PredictionMedicalTest
              patientName={patient.name}
              tests={tests}
              handleOpenTest={handleOpenTest}
              handelDownloadTest={handelDownloadTest}
            />
          )}

          <SelectPredictionType predType={predType} setPredType={setPredType} />

          <div className='flex flex-col lg:flex-row w-full gap-8'>
           <ClinicalDataPanel
 predType={predType}
  inputsToRender={predType === "PE" ? preeclampsiaInputs : clinicalInputs}
  risksToRender={predType === "PE" ? preeclampsiaRiskFields : riskFields}
  values={values}
  setters={setters}
  riskFactors={riskFactorsState}
  setRiskFactors={setRiskFactorsState}

                onGenerate={
    predType === "PE"
      ? handleGeneratePreeclampsia
      : handleGeneratePrediction
  }  
              loading={loading}
            />

            <PredictionResultCard
              predictionResult={predictionResult}
              levelStyle={levelStyle}
              patient={patient}
              patientId= {id}
              predictionRecordId={predictionRecordId}
              handelUpdateMedicalHistory={handelUpdateMedicalHistory}
              handelUpdatePrescription={handelUpdatePrescription}
              handleAddMedicalHistory={handleAddMedicalHistory}
              setFormData={setFormData}
              formData={formData}
              type={predType}
            />
          </div>

          <PredictionHistoryPanel
            predictions={predictions}
            setSelectedPredictionId={setSelectedPredictionId}
            setSelectedMedicalHistoryId={setSelectedMedicalHistoryId}
            selectedPredictionId={selectedPredictionId}
            selectedMedicalHistoryId={selectedMedicalHistoryId}
            patient={patient}
            patientId={id}
            handleDeleteMedicalHistory={handleDeleteMedicalHistory}
            handleDeleteMedicine={handleDeleteMedicine}
            handelUpdateMedicalHistory={handelUpdateMedicalHistory}
            handelUpdatePrescription={handelUpdatePrescription}
          />

        </div>
      </div>

      <FilePreviewModal
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
      />
    </>
  );
}