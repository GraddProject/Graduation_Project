import React from 'react'
import { useContext , useState , useEffect } from 'react';
import { UserContext } from "../../Components/context/User.context";
import { List , ChartColumn } from 'lucide-react';
import { Label } from 'recharts';
import axios from "axios";
import { getInitials } from '../../helpers/getInitials';
import MedicalRecordForm from '../../Components/MedicalRecordForm/MedicalRecordForm';
import PredictionLevelCharts from '../../Components/PredictionLevelCharts/PredictionLevelCharts';
import PredictionPatientCard from '../../Components/PredictionPatientCard/PredictionPatientCard';
import ProgressBar from '../../Components/ProgressBar/ProgressBar';
import PredictionDetails from '../../Components/PredictionDetails/PredictionDetails';
import DetailedMedicalRecord from '../../Components/DetailedMedicalRecord/DetailedMedicalRecord';
import PredictionRiskCard from '../../Components/PredictionRiskCard/PredictionRiskCard';

export default function PredictionHistory() {
    const [showMedical , setShowMedical] = useState(null);
    const [riskDashboard, setRiskDashboard] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [view, setView] = useState("list");
    const [selectedPredictionId, setSelectedPredictionId] = useState(null);
    const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(UserContext);
    const [patient, setPatient] = useState(null);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

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

      const formattedPredictions = list.map((predication) => ({
        id: predication.predictionRecordId,
        patientId: predication.patientId,
        medicalHistoryId: predication.medicalHistoryId,
        patientName: predication.patientName,
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

    const getRiskDashboard = async () => {
    try {
      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/risk-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRiskDashboard(data);
      console.log("Risk Dashboard:", data);
      } catch (error) {
        console.error("Failed to fetch risk dashboard:", error);
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
        if (token) {
            getAllPredictions();
            getRiskDashboard();
            getPatient();
        }
    }, [token]);


    const visiblePredictions = showAll
    ? predictions
    : predictions.slice(0, 10);

    return <>
     <div className='px-8 py-4'>
       
        <div className='bg-white w-full rounded-xl shadow  px-5 py-2 flex flex-row items-center justify-between'>
          <h1 className='text-[#1A2E1CFF]  font-semibold'>
            {view === "list" ? "Prediction History" : "Prediction Risk Overview"}
          </h1>

          <div className="flex gap-2 items-center rounded-[12px] px-2 ">
            <div
              onClick={() => setView("list")}
              className={`cursor-pointer flex items-center justify-center p-2  rounded-[10px] transition-all
              ${view === "list" ? "bg-white text-[#171A1F]" : "text-[#566454]"}`}
            >
              <List size={22} />
            </div>

            <div
              onClick={() => setView("chart")}
              className={`cursor-pointer flex items-center justify-center p-2 rounded-[10px] transition-all
              ${view === "chart" ? "bg-white text-[#171A1F]" : "text-[#566454]"}`}
            >
               <ChartColumn size={22} />
            </div>
          </div>
        </div>

        <div className='mb-4'>
          {view === "chart" ? <div className="grid grid-cols-2 gap-4 mt-4">
              {riskDashboard.map((item) => (
                <PredictionRiskCard
                  key={item.type}
                  riskData={item}
                />
              ))}
          </div> : 
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
            {visiblePredictions.map((prediction , index) => (
              <PredictionPatientCard key={index} {...prediction} onViewDetails={() => setSelectedPredictionId(prediction.id)}  showMedical={(medicalHistoryId) => {setSelectedMedicalHistoryId(medicalHistoryId); setSelectedPatientId(prediction.patientId); }} />
            ))}
            </div>
          }

          {predictions.length > 6 && view === "list" && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-1 bg-[#4A6B4EFF] w-52 text-white rounded-3xl"
              >
                {showAll ? "Show Less" : "View All"}
              </button>
            </div>
          )}
        </div>

          {selectedPredictionId && (
            <PredictionDetails
              predictionId={selectedPredictionId}
              onClose={() => setSelectedPredictionId(null)}
            />
          )}

          {selectedMedicalHistoryId  && (
            <DetailedMedicalRecord  medicalHistoryId={selectedMedicalHistoryId} patientId={selectedPatientId} onClose={() => setSelectedMedicalHistoryId(null)} onDeleteMedicalHistory={handleDeleteMedicalHistory} onDeleteMedicine={handleDeleteMedicine} onUpdateMedicalHistory={handelUpdateMedicalHistory} onUpdatePrescription={handelUpdatePrescription}   patientInfo={{ name: patient?.name, week: patient?.week, imageUrl: patient?.imageUrl, initials: getInitials(patient?.name) }}/>
          )}  
     </div>     
  
  </>
}
