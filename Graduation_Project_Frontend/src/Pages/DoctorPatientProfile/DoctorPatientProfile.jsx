import React from 'react'
import {Bell , Mail , Phone , Calendar , ChevronLeft , Stethoscope , Plus ,  FlaskConical , ChartSpline , RefreshCcw, Cast, X} from 'lucide-react'
import img from "../../assets/doctor.png";
import { useParams } from "react-router-dom";
import {useEffect , useState  , useContext} from 'react';
import ProgressBar from '../../Components/ProgressBar/ProgressBar';
import { useNavigate } from 'react-router-dom';
import MedicalRecordForm from '../../Components/MedicalRecordForm/MedicalRecordForm';
import MedicineCard from '../../Components/MedicineCard/MedicineCard';
import LabTestCard from '../../Components/LabTestCard/LabTestCard';
import PredictionHistoryCard from '../../Components/PredictionHistoryCard/PredictionHistoryCard';
import axios from 'axios';
import { UserContext } from "../../Components/context/User.context";
import { formatDate } from '../../helpers/formatDate';
import MedicalHistoryCard from '../../Components/MedicalHistoryCard/MedicalHistoryCard';
import { MODES } from '../../helpers/medicalModes';
import { getInitials } from '../../helpers/getInitials';

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

    console.log(list);

    const formattedMedicalHistory = list.map((medicalHistory) => ({
      medicalId: medicalHistory.id,
      addDate : medicalHistory.createdAt, 
      diagnosis: medicalHistory.diagnosis,
      vitalSigns: medicalHistory.vitalSigns,
      notes : medicalHistory.notes,
      preScriptions: medicalHistory.preScriptions?.map((p) => ({
        id: p.id,
        medicationName: p.medicationName,
        dosage: p.dosage,
        duration: p.duration,
        instructions: p.instructions
      })) || []
    }))

    setMedicalHistory(formattedMedicalHistory);


    }catch(error){
      console.log(error)
    }
  }

  const handleAddMedicalHistory = (newRecord) => {
  setMedicalHistory(prev => [newRecord, ...prev]);
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
      prev.filter(item => item.medicalId !== medicalId)
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


    setMedicalHistory(prev =>
      prev.map(item =>
        item.medicalId === medicalId
          ? {
              ...item,
              preScriptions: item.preScriptions.filter(p => p.id !== prescriptionId)
            }
          : item
      )
    );

  } catch (error) {
    console.log(error);
  }
  };

  const handelUpdateMedicalHistory = (updated) =>{
    setMedicalHistory(prev => 
      prev.map(item => item.medicalId === updated.id ? {
        ...item,
        diagnosis: updated.diagnosis,
        vitalSigns: updated.vitalSigns,
        notes: updated.notes,

      }: item)
    )
  }

  const handelUpdatePrescription = (medicalId , updaedPrescriptions) =>{
    setMedicalHistory(prev => 
      prev.map(item => item.medicalId === medicalId ? {
        ...item,
        preScriptions: updaedPrescriptions,
      }: item)
    )
  }

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

  if (loading) return <div className="p-10">Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  const progress = getPregnancyProgress(Number(patient.week || 0));
  

  return <>
      <div className='w-full' >

      <div className='bg-[#F7F9F7FF] w-full  px-8 py-4 flex-1 min-h-screen z-0'>
        <div className="flex bg-white rounded-xl shadow overflow-hidden ">
        <div className="w-[4px] bg-gradient-to-b from-[#4A5F4E] to-[#667E68]"></div>
        <div className="flex px-3 py-4 justify-between items-center w-full">
          <div className='flex flex-row items-center gap-4'>
            <div className=" cursor-pointer relative"  >
              {patient.image && !imageError ? (
                <img
                  src={patient.image}
                  alt="User Avatar"
                  onError={() => setImageError(true)}
                  className="w-14 h-14 rounded-full object-cover cursor-pointer"
                />
              ) : (
        
              <div className="w-16 h-16 rounded-full bg-[#4A6B4E] flex items-center justify-center text-lg text-white font-bold"
              >
                {getInitials(patient.name)}
              </div>
            )}

            <div className='w-3 h-3 rounded-full bg-[#3ac654] absolute bottom-0 right-1 z-10 border-[2px] border-white'></div>
    
          </div>
          <div className='flex flex-col  justify-center gap-1 '>
            <div className='flex flex-row items-center gap-2'>
              <h1 className="font-bold text-[#191B18FF] text-lg cursor-pointer ">
                {patient.name}
                
              </h1>
              <span className='px-3 py-0.5 text-xs font-semibold rounded-2xl bg-[#ebffef] text-[#247b34] border border-[#247b344c]'>{patient.actived ? "Active" : "Inactive"}</span>
            </div>
            <div className='flex flex-row gap-4 items-center'>
              <div className='flex flex-row items-center gap-1'>
                <Mail size={12} className="text-[#566454]" />
                <span className="text-[#a3a79f] text-xs">
                  {patient.email}
                </span>
              </div>
              <div className='flex flex-row items-center gap-1'>
                <Phone size={12} className="text-[#C9955FFF]" />
                <span className="text-[#a3a79f] text-xs">
                  {patient.phone}
                </span>
              </div>
              <div className='flex flex-row items-center gap-1'>
                <Calendar size={12} className="text-[#566454]" />
                  <span className="text-[#a3a79f] text-xs">
                    Member Since {formatDate(patient.activeDate)}
                  </span>
            </div>
            </div>
            <div className='flex flex-row items-center gap-2 mt-1'>
              <div className='bg-[#eef4ee] border border-[#c8ddc8] border-1 rounded-2xl py-1 px-3 flex items-center '>
                <p className='text-[#2d4a2d] text-xs ' >BloodType: {patient.bloodType}</p>
              </div>
              
              <div className='bg-[#eef4ee] border border-[#c8ddc8] border-1 rounded-2xl py-1 px-3 flex items-center '>
                <p className='text-[#2d4a2d] text-xs ' >Age: {patient.age} Year</p>
              </div>

              <div className='bg-[#eef4ee] border border-[#c8ddc8] border-1 rounded-2xl py-1 px-3 flex items-center '>
                <p className='text-[#2d4a2d] text-xs ' >Height: {patient.height} cm</p>
              </div>

              <div className='bg-[#eef4ee] border border-[#c8ddc8] border-1 rounded-2xl py-1 px-3 flex items-center '>
                <p className='text-[#2d4a2d] text-xs ' >Weight: {patient.weight} kg</p>
              </div>
              
              <div className='bg-[#eef4ee] border border-[#c8ddc8] border-1 rounded-2xl py-1 px-3 flex items-center '>
                <p className='text-[#2d4a2d] text-xs ' >Num Of Pregnancies: {patient.numberofPregnancies}</p>
              </div>
            </div>
          </div>

          </div>
          <div className='flex flex-col gap-3 px-3 py-2 w-4/12'>
            <div className='flex flex-row items-center justify-between gap-6'>
              <p className='text-[#a3a79f] font-semibold text-xs uppercase'>Pregnancy Progress</p>
              <p className='text-[#4A5F4EFF] font-semibold text-xs'>ًWeek {patient.week}  / {patient.trimester}</p>
            </div>
            <div >
              <ProgressBar value={progress.percentage} color={"#667E68FF"} />
            </div>
            <div className='flex flex-row items-center justify-between'>
              <span className="text-[#a3a79f] text-xs">
                StartDate: {formatDate(patient.startDate)}
              </span>
              
            </div>

          </div>
        </div>
        </div>
        
        <div className='w-full flex flex-row  gap-4 py-4 mt-3 pl-1'>
          <div className='w-7/12 '>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-row gap-2 items-center'>
                <Stethoscope size={20} className='text-[#4A5F4EFF]' />
                <h2 className='text-[#1A2E1CFF]'>Medical Records</h2>
                <div className='px-2 py-1 rounded-2xl bg-[#E8F5E8FF]'>
                  <p className='text-[#667E68FF] font-semibold text-sm'>{medicalHistory.length}</p>
                </div>

              </div>
              <div className='flex flex-row items-center gap-1 cursor-pointer' onClick={() => setFormData({ open: true, mode: MODES.CREATE, patientId: patient.id , patientInfo: { name: patient.name, week :patient.week,  imageUrl: patient.imageUrl || null, initials: getInitials(patient.name)}})}>
                <Plus size={15} strokeWidth={3} className='text-[#4A5F4EFF] font-bold' />
                <h3 className='text-[#4A5F4EFF] font-semibold text-sm'>Add Record</h3>
              </div>
              {formData.open && ( <MedicalRecordForm formData={formData} onUpdatedHistory={handelUpdateMedicalHistory} onUpdatePrescription={handelUpdatePrescription} onSuccess={handleAddMedicalHistory} onClose={() => setFormData({ open: false, mode: null, patientId: id, predictionRecordId: null , patientInfo: null })}/>)}

            </div>
            <div className='flex flex-col gap-4'>
              {medicalHistory.map((history, index) => (
                <MedicalHistoryCard
                  key={index}
                  mode= {"doctorview"}
                  MedicalHistory = {history}
                  PatientId = {id}
                  MedicalId = {history.medicalId}
                  onDelete={handleDeleteMedicalHistory}
                  onDeleteMedicine = {handleDeleteMedicine}
                  setFormData={setFormData}
                  patientInfo={{
                    name: patient.name,
                    imageUrl: patient.imageUrl,
                    initials: getInitials(patient.name)
                  }}
                   />
                ) 
              )}

            </div>

          </div>

          <div className='flex w-5/12 flex-col gap-7 '>
          <div className='w-full bg-white rounded-xl shadow '>
            <div className='header w-full bg-[#F5F0FAFF] px-3 py-3 flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                <FlaskConical size={20} className='text-[#9B7CB6FF]' />
                <h2 className='text-[#1A2E1CFF]'>Lab Tests</h2>

                <div className='px-2 py-0.5 rounded-2xl bg-[#9B7CB6FF] ml-1'>
                  <p className='text-white font-semibold text-xs'>6</p>
                </div>


              </div>
              <button className='text-[#9B7CB6FF] text-sm '>View ALL</button>

            </div>
            <div className='px-3 mt-3 flex flex-col gap-3'>
              {medicalTests.map((test, index) => (
                <LabTestCard
                  key={index}
                  name={test.testName}
                  date={test.uploadedTime}
                  mode={mode}
                  download={() => handelDownloadTest(test.id , test.testName)}
                  onClick={() => handleOpenTest(test.id)}
                />
              ))}

            </div>
          </div>
          
          <div className='w-full flex flex-col gap-2'>

            <div className=' flex flex-col  bg-white border border-[#DEE1E6FF] shadow rounded-xl '>
              <div className='header w-full pl-4 pr-3 bg-[#eef6f0] py-3 flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                <ChartSpline  size={20} className='text-[#4A5F4EFF]' />
                <h2 className='uppercase text-sm text-[#1A2E1CFF]'>Prediction History</h2>

              </div>
              <div className='flex flex-row gap-1  p-2 rounded-lg items-center cursor-pointer' onClick={()=>{navigate(`/doctor/prediction/${patient.id}`)}}>
                <RefreshCcw size={17} className='text-[#4A5F4EFF]' />
                <h2 className='text-[#1A2E1CFF] text-sm'>Run Prediction</h2>

              </div>

            </div>
              {predictionHistory.map((prediction) => (
                <PredictionHistoryCard
                  key={prediction.predictionRecordId}
                  month={prediction.month}
                  day={prediction.day}
                  predictionType={prediction.predictionType}
                  risk={prediction.risk}
                  confidence={prediction.confidence}
                />
                ))}           
            </div>
          </div>
          </div>
        </div>
        {previewFile && ( 
           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <button
              className="absolute top-3 right-3 bg-[#2d2d2d] text-white px-3 py-1 rounded"
              onClick={() => setPreviewFile(null)}
              >
               <X/>
              </button>
                
              <div className="bg-white w-[80%] h-[85%] rounded-xl relative overflow-hidden">
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
      </div>
    </div>
  
  
  </>
}
