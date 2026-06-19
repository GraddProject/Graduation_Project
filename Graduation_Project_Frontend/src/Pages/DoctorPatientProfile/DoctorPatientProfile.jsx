import React from 'react'
import {Bell , Mail , Phone , Calendar , ChevronLeft , Stethoscope , Plus ,  FlaskConical , ChartSpline , RefreshCcw, Cast, X} from 'lucide-react'
import img from "../../assets/doctor.png";
import { useParams } from "react-router-dom";
import {useEffect , useState  , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../../Components/context/User.context";
import { formatDate } from '../../helpers/formatDate';
import { MODES } from '../../helpers/medicalModes';
import { getInitials } from '../../helpers/getInitials';
import { riskStyles } from '../../helpers/riskStyle';
import PatientHeaderCard from '../../Components/PatientHeaderCard/PatientHeaderCard';
import MedicalRecordsSection from '../../Components/MedicalRecordsSection/MedicalRecordsSection';
import LabTestsSection from '../../Components/LabTestSection/LabTestSection';
import PredictionHistorySection from '../../Components/PredictionHistorySection/PredictionHistorySection';
import FilePreviewModal from '../../Components/FilePreviewModal/FilePreviewModal';
import Loading from '../../Components/Loading/Loading';
export default function DoctorPatientProfile() {

  const { token } = useContext(UserContext); 
  const [imageError, setImageError] = useState(false);
  const [patient, setPatient] = useState(null);
  const [medicalTests, setMedicalTests] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [viewMedicalForm , setViewMedicalForm] = useState(false)
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode , setMode] = useState("Profile")
  const [formData, setFormData] = useState({
    open: false,
    mode: null,
    patientId: null,
    predictionRecordId: null,
    medicalHistoryId : null,
    prescriptionId : null,
    patientInfo: null,
    medicationName: "",
    dosage: "",
    duration: "",
    instructions: ""

  });
  const [previewFile, setPreviewFile] = useState(null);
  const [showAllTests, setShowAllTests] = useState(false);

  const { id } = useParams();
  const navigate= useNavigate();
  
  const getPatientById = async (id) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GetPatientById",
        {
          params: { patientId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedPatient = {
        id: data.patientId,
        name: data.displayName,
        image: data.profileImageUrl,
        email: data.email,
        phone: data.phoneNumber || "",
        activeDate: data.createdAt,
        imageUrl: data.imageUrl || null,
        actived: data.actived,
        week: data.pregnancyWeek,
        trimester: data.trimester,
        startDate: data.pregnancyStartDate,
        bloodType: data.bloodType,
        age: data.age,
        height: data.height,
        weight: data.weight,
        numberofPregnancies: data.numberOfPregnancies

      };


      setPatient(formattedPatient);

    } catch (error) {
      console.error("Failed to fetch patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedicalTest= async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GetPatientMedicalTests",
        {
          params: { patientId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = Array.isArray(data)
      ? data
      : data.data || data.tests || [];

      const formattedMedicalTests = list.map((t) => ({
      id: t.id,
      testName: t.fileName,
      uploadedTime: t.uploadedAt,
      }));

    setMedicalTests(formattedMedicalTests);
  

    } catch (error) {
      console.error("Failed to fetch patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedicalHistory = async (id) =>{
    try{
      setLoading(true)
      const {data} = await axios.get("https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GetPatientMedicalHistories",
      {
        params: {patientId: id},
        headers: {
           Authorization: `Bearer ${token}`,
        },
      } 
    );

      const list = Array.isArray(data)
        ? data
        : data.data || data.history || [];

      const formattedMedicalHistory = list.map((monthGroup) => ({
        month: monthGroup.month,

        items: monthGroup.items.map((item) => ({
          medicalId: item.medicalHistoryId,
          diagnosis: item.diagnosis,
          vitalSigns: item.vitalSigns,
          notes: item.notes,

          addDate: item.createdAt,
          date: item.date,
          time: item.time,

          hasPrediction: item.hasPrediction,

          prediction: item.prediction
            ? {
                predictionRecordId: item.prediction.predictionRecordId,
                type: item.prediction.type,
                result: item.prediction.result,
                riskLevel: item.prediction.riskLevel,
                confidencePercentage:
                  item.prediction.confidencePercentage,
                createdAt: item.prediction.createdAt,
              }
            : null,

          prescriptions:
            item.prescriptions?.map((p) => ({
              id: p.prescriptionId,
              medicationName: p.medicationName,
              dosage: p.dosage,
              duration: p.duration,
              instructions: p.instructions,
              createdAt: p.createdAt,
            })) || [],
        })),
      }));

    setMedicalHistory(formattedMedicalHistory);


    }catch(error){
      console.log(error)
    }
  }

  const handleAddMedicalHistory = (newRecord) => {
  setMedicalHistory(prev => {
    const updated = [...prev];

    if (updated.length > 0) {
      updated[0] = {
        ...updated[0],
        items: [newRecord, ...updated[0].items],
      };
    }

    return updated;
  });
};

  const handleDeleteMedicalHistory = async (medicalId) => {
  try {
    await axios.delete(
      `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients/${id}/medical-histories/${medicalId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );


    setMedicalHistory(prev =>
  prev
    .map(group => ({
      ...group,
      items: group.items.filter(
        item => item.medicalId !== medicalId
      ),
    }))
    .filter(group => group.items.length > 0)
);

  } catch (error) {
    console.log(error);
  }
  };

  const handleDeleteMedicine = async (medicalId , prescriptionId ) => {
  try {
    await axios.delete(
      `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients/${id}/medical-histories/${medicalId}/prescriptions/${prescriptionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );


    setMedicalHistory(prev => {
  const updated = prev.map(group => ({
    ...group,
    items: group.items.map(item =>
      item.medicalId === medicalId
        ? {
            ...item,
            prescriptions: item.prescriptions.filter(
              p => p.id !== prescriptionId
            ),
          }
        : item
    ),
  }));

  console.log(updated);

  return [...updated];
});

  } catch (error) {
    console.log(error);
  }
  };

const handelUpdateMedicalHistory = (updated) => {
  setMedicalHistory(prev =>
    prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.medicalId === updated.id
          ? {
              ...item,
              diagnosis: updated.diagnosis,
              vitalSigns: updated.vitalSigns,
              notes: updated.notes,
            }
          : item
      ),
    }))
  );
};

 const handelUpdatePrescription = (
  medicalId,
  updatedPrescriptions
) => {
  setMedicalHistory(prev =>
    prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.medicalId === medicalId
          ? {
              ...item,
              prescriptions: updatedPrescriptions,
            }
          : item
      ),
    }))
  );
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

      const fileType = response.data.type || response.headers["content-type"];

      setPreviewFile({
        url: fileURL,
        type: fileType,
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

  const getPredictionHistory = async (id) => {
    try {
      const { data } = await axios.get(
        `https://her-journey-1044023551709.us-central1.run.app/api/Doctor/patients/${id}/prediction-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedPredictions = data.map((prediction) => ({
        predictionRecordId: prediction.predictionRecordId,
        date: prediction.createdAt,
        month : prediction.month,
        day : prediction.day,
        predictionType: prediction.type,
        risk: prediction.riskLevel.replace(" Risk", ""),
        confidence: prediction.confidence,
        medicalHistoryId: prediction.medicalHistoryId,
      }));

      setPredictionHistory(formattedPredictions);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (id){
      getPatientById(id);
      getMedicalTest(id);
      getMedicalHistory(id);
      getPredictionHistory(id);
    }
  }, [id]);

  const getPregnancyProgress = (currentWeek) => {
    const totalWeeks = 40;
    const percentage = Math.min((currentWeek / totalWeeks) * 100, 100);

    return {
      week: currentWeek,
      percentage: Math.round(percentage),
    };
  };

  const patientDisplay = {
  name: patient?.name,
  imageUrl: patient?.imageUrl,
  initials: getInitials(patient?.name)
};

    if (loading ||!patient ) {
    
      return <Loading text="Loading Patient Profile..." />;
    
  }

  const progress = getPregnancyProgress(Number(patient.week || 0));
  
  return <>

      <div className='bg-[#F7F9F7FF] w-full px-3 lg:px-8 py-4 flex-1 min-h-screen z-0'>

        <PatientHeaderCard
          patient={patient}
          imageError={imageError}
          setImageError={setImageError}
          progress={progress}
        />
        
        <div className='w-full flex flex-col sm:flex-row gap-4 py-4 mt-3 pl-1'>
          <MedicalRecordsSection
            medicalHistory={medicalHistory}
            patient={patient}
            id={id}
            formData={formData}
            setFormData={setFormData}
            handleAddMedicalHistory={handleAddMedicalHistory}
            handelUpdateMedicalHistory={handelUpdateMedicalHistory}
            handelUpdatePrescription={handelUpdatePrescription}
            handleDeleteMedicalHistory={handleDeleteMedicalHistory}
            handleDeleteMedicine={handleDeleteMedicine}
          />

          <div className='flex w-full sm:w-5/12 flex-col gap-7 '>
            <LabTestsSection
              medicalTests={medicalTests}
              showAllTests={showAllTests}
              setShowAllTests={setShowAllTests}
              mode={mode}
              handelDownloadTest={handelDownloadTest}
              handleOpenTest={handleOpenTest}
            />
 
            <PredictionHistorySection
              predictionHistory={predictionHistory}
              patientId={patient.id}
            />
          </div>
        </div>

        <FilePreviewModal
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      </div>

  </>
}
