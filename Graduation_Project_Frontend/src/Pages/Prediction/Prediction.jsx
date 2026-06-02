import React, { useState , useEffect  } from 'react'
import { Bell, FileText, Leaf , HeartPulse  , ChartColumn , List  ,Image , File , ChevronLeft , X} from "lucide-react";
import img from "../../assets/doctor.png";
import { Label } from 'recharts';
import ModelInputFeature from '../../Components/ModelInputFeature/ModelInputFeature';
import ModelSelectFeature from '../../Components/ModelSelecteFeature/ModelSelectFeature';
import ProgressBar from '../../Components/ProgressBar/ProgressBar';
import DashboardTableHeader from '../../Components/DashboardTableHeader/DashboardTableHeader';
import DoctorDashboardCharts from '../../Components/PredictionLevelCharts/PredictionLevelCharts';
import PredictionPatientCard from '../../Components/PredictionPatientCard/PredictionPatientCard';
import PredictionTypeCard from '../../Components/PredictionTypeCard/PredictionTypeCard';
import MedicalRecordForm from '../../Components/MedicalRecordForm/MedicalRecordForm';
import PredictionLevelCharts from '../../Components/PredictionLevelCharts/PredictionLevelCharts';
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../Components/context/User.context";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { MODES } from '../../helpers/medicalModes';
import { getInitials } from '../../helpers/getInitials';
import LabTestCard from '../../Components/LabTestCard/LabTestCard';
import PredictionMedicalTest from '../../Components/PredictionMedicalTest/PredictionMedicalTest';
import SelectPredictionType from '../../Components/SelectPredictionType/SelectPredictionType';
import PredictionDetails from '../../Components/PredictionDetails/PredictionDetails';
import DetailedMedicalRecord from '../../Components/DetailedMedicalRecord/DetailedMedicalRecord';
import PredictionRiskCard from '../../Components/PredictionRiskCard/PredictionRiskCard';


export default function Prediction() {

  const getLevelFromConfidence = (confidence) => {
  const value = Number(confidence);

  if (value >= 70) return "high";
  if (value >= 40) return "medium";
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
        color: "#C97272",
        bg: "#D7263D1A",
        border: "#C9727233",
        progress: "#C97272"
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
  const navigate= useNavigate();
  const [mode , setMode] = useState("Prediction");

  const [offset, setOffset] = useState(0);
  const [age, setAge] = useState("");
  const [numPregnancies, setNumPregnancies] = useState("");
  const [prevGestation, setPrevGestation] = useState("");
  const [bmi, setBmi] = useState("");
  const [hdlCholesterol, setHdlCholesterol] = useState("");
  const [ogtt, setOgtt] = useState("");
  const [systolicBp, setSystolicBp] = useState("");
  const [diastolicBp, setDiastolicBp] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [predictionResult, setPredictionResult] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null);
  const [riskFactors , setRiskFactors] = useState({
    Family_History: 0,
    PCOS: 0,
    unexplained_prenetal_loss: 0,
    Large_Child_or_Birth_Default: 0,
    Sedentary_Lifestyle: 0,
    Prediabetes: 0
  })
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
  const [previewFile, setPreviewFile] = useState(null);
  const [predictionRecordId, setPredictionRecordId] = useState(null);
  const [showMedical , setShowMedical] = useState(null);

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
    console.log(patientData)

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
    console.log(list)

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

    console.log(response.data); 

    const fileURL = window.URL.createObjectURL(response.data);

    setPreviewFile({
      url: fileURL,
      type: response.data.type,
    });

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
    
  if (
    age === null ||
    numPregnancies === null ||
    prevGestation === null ||
    bmi === null ||
    ogtt === null ||
    systolicBp === null ||
    diastolicBp === null ||
    hemoglobin === null
  ) {
    alert("Please fill all required fields");
    return;
  }
    
    const { data } = await axios.post(
      "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GDM",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPredictionResult(data);
    console.log(data)
    const predictionsResponse = await axios.get(
      "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/PredictionsList",
      {
        headers: {
        Authorization: `Bearer ${token}`,
        },
      }
    );

    const patientPredictions = predictionsResponse.data.filter(
      (p) => p.patientName === patient.name
    );

    const latestPrediction = patientPredictions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];

    setPredictionRecordId(latestPrediction?.predictionRecordId || null);

  } catch (error) {
    console.log("Prediction Error:", error);
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
      console.log(formattedPredictions);

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

  useEffect(() => {
    if (!token || !id) return;
    getPatient();
    getLabTests();
  }, [id, token]);

  useEffect(() => {
    if (patient) {
      getAllPredictions();
    }
  }, [patient]);


  const confidenceValue = Number(predictionResult?.confidence || 0);
  const level = getLevelFromConfidence(confidenceValue);
  const levelStyle = getLevelStyle(level);
  const visiblePredictions = showAll
  ? predictions
  : predictions.slice(0, 6);
  

  
  return <>
    <div className='w-full '>
      
      <div className="bg-[#F7F9F7FF] px-8 py-1">

        {patient && (
          <PredictionMedicalTest
            patientName={patient.name}
            tests={tests}
            handleOpenTest={handleOpenTest}
          />
        )}

        <SelectPredictionType/>
        
        <div className='flex flex-row w-full gap-8'>
          <div className='bg-white w-7/12 rounded-xl shadow mt-3 px-5 py-4'>
            <h1 className='text-[#1A2E1CFF] mb-4 font-semibold'>
              Set & Review Clincal Data
            </h1>
            
            <div className="grid grid-cols-3 gap-4 mt-4 border-b pb-4">
              <ModelInputFeature label="AGE" id="age" value={age} setValue={setAge} />
              <ModelInputFeature label="NO. OF PREGNANCIES" id="numPregnancies" value={numPregnancies} setValue={setNumPregnancies} />
              <ModelInputFeature label="PREV. GESTATION" id="prevGestation" value={prevGestation} setValue={setPrevGestation} />

              <ModelInputFeature label="BMI (KG/M²)" id="bmi" value={bmi} setValue={setBmi} />
              <ModelInputFeature label="HDL CHOLESTEROL" id="hdlCholesterol" value={hdlCholesterol} setValue={setHdlCholesterol} />
              <ModelInputFeature label="OGTT (MG/DL)" id="ogtt" value={ogtt} setValue={setOgtt} />

              <ModelInputFeature label="SYSTOLIC BP" id="systolicBp" value={systolicBp} setValue={setSystolicBp} />
              <ModelInputFeature label="DIASTOLIC BP" id="diastolicBp" value={diastolicBp} setValue={setDiastolicBp} />
              <ModelInputFeature label="HEMOGLOBIN" id="hemoglobin" value={hemoglobin} setValue={setHemoglobin} />
            </div>

            <h2 className='text-[#4A6B4EFF] my-3 font-semibold'>
              Risk Factors
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <ModelSelectFeature label="Family History" value={riskFactors.Family_History} onChange={(val) => setRiskFactors(prev => ({ ...prev, Family_History: val }))} />
              <ModelSelectFeature label="PCOS" value={riskFactors.PCOS} onChange={(val) => setRiskFactors(prev => ({ ...prev, PCOS: val }))}/>
              <ModelSelectFeature label="Unexplained Prenatal Loss" value={riskFactors.unexplained_prenetal_loss}  onChange={(val) => setRiskFactors(prev => ({ ...prev, unexplained_prenetal_loss: val }))}/>
              <ModelSelectFeature label="Large Child/Birth Defect" value={riskFactors.Large_Child_or_Birth_Default} onChange={(val) => setRiskFactors(prev => ({ ...prev, Large_Child_or_Birth_Default: val }))} />
              <ModelSelectFeature label="Sedentary Lifestyle"  value={riskFactors.Sedentary_Lifestyle} onChange={(val) => setRiskFactors(prev => ({ ...prev, Sedentary_Lifestyle: val }))}/>
              <ModelSelectFeature label="Prediabetes" value={riskFactors.Prediabetes} onChange={(val) => setRiskFactors(prev => ({ ...prev, Prediabetes: val }))}/>
             
            </div>

            <button className='w-full bg-[#4A6B4EFF] text-white rounded-xl mt-4 py-2 font-semibold'  onClick={handleGeneratePrediction}>
             {loading ? "Loading..." : "Generate Prediction"}
            </button >
          </div>

          <div className='bg-white w-5/12 rounded-xl shadow mt-3 px-5 py-4'>
            <h1 className='text-[#1A2E1CFF] mb-4 font-semibold'>
              Prediction Result
            </h1>

            <div
              className="w-24 h-24 rounded-full border-[4px] mx-auto mt-12 flex items-center justify-center"  style={{borderColor: levelStyle.border, background: levelStyle.bg}}>
              <p
                className="text-center font-semibold uppercase text-sm"
                style={{ color: levelStyle.color }}

              >
                {levelStyle.text}
              </p>
            </div>

            <div className='flex flex-col items-center justify-center gap-2 mt-5'>
              <span className='text-[#171A1FFF] font-bold text-md' >{predictionResult?.result || "No Result Yet"}</span>
            </div>

            <div className='flex flex-col gap-2 mt-10'>
              <div className='flex flex-row justify-between items-center'>
                <h4 className='text-[#565D6DFF]'>Confidence Level</h4>
                <span className=' font-bold text-sm' style={{ color: levelStyle.color }} >{predictionResult?.confidence || 0}%</span>
              </div>
              <ProgressBar width={'full'} value={predictionResult?.confidence || 0} color={levelStyle.progress}/>
            </div>

            <div className='flex flex-col items-center  gap-2 mt-4'>
            <button className='w-full bg-[#4A6B4EFF] text-white rounded-xl border-2 border-[#4A6B4EFF]  py-2 '>
              Save Prediction Result
            </button >

            <button 
             onClick={() => setFormData({
              open: true,
              mode: MODES.PREDICTION,
              patientId: patient.id,
              predictionRecordId: predictionRecordId,
              patientInfo: { name: patient.name, week: patient.week ,imageUrl: patient.imageUrl || null, initials: getInitials(patient.name)}
              })
            }
             className='w-full bg-[#FFFFFFFF] text-black rounded-xl font-medium border-2 px-2  py-2 '>
              Add Diagnosis 
            </button >
            </div>

            <div className=' flex flex-row items-center justify-center gap-2 bg-[#F4FBF4FF] text-[#4A6B4EFF] rounded-lg mt-4 font-medium mx-2   py-2 '>
              <div className='w-3 h-3 rounded-full bg-[#adc3af]'></div>
              Model: Analysis Completed
            </div >
         
          </div>
          {formData.open && (<MedicalRecordForm formData={formData} onSuccess={() => { getAllPredictions(); }}

            onClose={() =>
              setFormData({
                open: false,
                mode: null,
                patientId: id,
                predictionRecordId: null,
                patientInfo:null
              })
            }
            />
          )}
      
        </div>
        
        <div className='bg-white w-full rounded-xl shadow mt-4  px-5 py-2 '>
          <h1 className='text-[#1A2E1CFF]  font-semibold'>
            Prediction History
          </h1>
        </div>

        <div className='mb-4'>
            <div>
            <div className="hidden md:block w-full pt-6 pb-3  pl-5 ">
              <div className="users-info-nav  grid grid-cols-[1.4fr_1.2fr_1fr_1.2fr_1.5fr_2fr] uppercase text-[13px] text-[#2C3E2FFF] font-bold">
                <div>Patient</div>
                <div>Type</div>
                <div>Date</div>
                <div>Result</div>
                <div>Confidence</div>
                <div >Action</div>
                </div>
            </div>
            {predictions.map((prediction , index) => (
              <PredictionPatientCard key={index} {...prediction} onViewDetails={() => setSelectedPredictionId(prediction.id)}  showMedical={(medicalHistoryId) => {setSelectedMedicalHistoryId(medicalHistoryId);}} />
            ))}
            </div>
        </div>

          {selectedPredictionId && (
            <PredictionDetails
              predictionId={selectedPredictionId}
              onClose={() => setSelectedPredictionId(null)}
            />
          )}

          {selectedMedicalHistoryId  && (
            <DetailedMedicalRecord  medicalHistoryId={selectedMedicalHistoryId} patientId={id} onClose={() => setSelectedMedicalHistoryId(null)} onDeleteMedicalHistory={handleDeleteMedicalHistory} onDeleteMedicine={handleDeleteMedicine} onUpdateMedicalHistory={handelUpdateMedicalHistory} onUpdatePrescription={handelUpdatePrescription}   patientInfo={{ name: patient?.name, week: patient?.week, imageUrl: patient?.imageUrl, initials: getInitials(patient?.name) }}/>
          )}  
      </div>
    </div>
      {previewFile && ( 
        <div className="fixed top-24 right-2 z-50 w-[38%] h-[85vh] ">
          <button
            onClick={() => setPreviewFile(null)}
            className="absolute top-5 right-3 z-20  w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E7EB] shadow-md flex items-center justify-center hover:bg-[#F3F4F6] transition-all duration-200" >
              <X size={18} className="text-[#565D6D]" />
          </button>
                
          <div className="bg-white w-full h-full rounded-2xl shadow-2xl border relative overflow-hidden">
            <div className="w-full h-full">
              {previewFile.type === "application/pdf" ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full"
                />
              ) : (
                <img
                  src={previewFile.url}
                  className="w-full h-full object-contain"
                />
                )}
            </div>
          </div>
        </div>
      )}
  </>
} 