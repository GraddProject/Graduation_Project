import { Pen, PenLine, Trash2, X } from 'lucide-react' 
import { getInitials } from '../../helpers/getInitials'
import { UserContext } from '../context/User.context';
import MedicineCard from '../MedicineCard/MedicineCard';
import axios from "axios";
import MedicalRecordForm from '../MedicalRecordForm/MedicalRecordForm';
import { MODES } from '../../helpers/medicalModes';
import { useContext, useState, useEffect } from 'react'
import { formatDate } from '../../helpers/formatDate';

export default function DetailedMedicalRecord({ medicalHistoryId, patientId , onClose ,   onDeleteMedicalHistory, onDeleteMedicine, onUpdateMedicalHistory, onUpdatePrescription , patientInfo}) {

  const [medicalRecord, setMedicalRecord] = useState(null);
  const {token} = useContext(UserContext);
  const [formData, setFormData] = useState({
    open: false,
    mode: null,
    patientId: null,
    medicalHistoryId: null,
    prescriptionId: null,
    patientInfo: null
  });

  const getMedicalHistoryById = async () => {
    try {

      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/GetMedicalHistoryById",
        {
          params: {
            patientId,
            medicalHistoryId
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedMedicalHistory = {
        medicalId: data.id,
        predictionId: data.predictionRecordId,
        createDate: data.createdAt,
        diagnosis: data.diagnosis,
        vitalSigns: data.vitalSigns,
        notes: data.notes,
        createdAt: data.createdAt,
        preScriptions:
          data.preScriptions?.map((p) => ({
            id: p.id,
            medicationName: p.medicationName,
            dosage: p.dosage,
            duration: p.duration,
            instructions: p.instructions
          })) || []
      };

      setMedicalRecord(formattedMedicalHistory);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!medicalHistoryId) return;

    getMedicalHistoryById();
  }, [medicalHistoryId]);

  return <>
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-[0px_2px_4px_#00000012] w-full max-w-lg  max-h-[96vh] overflow-y-auto'>
        <div className='flex  justify-between pb-3 border-b px-4 py-5 '>
          <div className='flex flex-col '>
            <h2 className='font-bold'>Prediction Medical History</h2>
            <span className='text-[#BEC3BBFF] text-xs'>Captured on {formatDate(medicalRecord?.createdAt)} </span>
          </div>
          <div className="flex justify-end mt-1" onClick={onClose}>
            <X size={20} className="text-[#8A9A8AFF] cursor-pointer" />
          </div>
        </div>

        <div className="flex gap-3 items-center mt-4 px-3 py-2 mx-4 bg-[#F3F4F666] border border-[ #DEE1E6FF] rounded-2xl"> 
          {patientInfo?.imageUrl ?(
            <img
              src= {patientInfo?.imageUrl}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"/>
          ): (
            <div className="w-10 h-10 rounded-full bg-[#4A6B4E] flex items-center justify-center text-white font-bold">
              {getInitials(patientInfo?.name)}
            </div>
          )}
        
          <div className='flex flex-col justify-center gap-2'>
            <span className="font-bold text-[#171A1FFF] text-[16px] ">
              {patientInfo?.name}
            </span>
            <span className='text-[#565D6DFF] text-sm'>Prenatal Care Path · Week {patientInfo?.week}</span>
          </div>
        </div>

        <div className='flex flex-col gap-4  ml-2 px-4 py-5 '>
          <div className='flex flex-col gap-1'>
            <h3 className='text-[#7e8086] text-sm'>Diagnosis</h3>
            <p className='text-[#222B23FF] text-sm '>{medicalRecord?.diagnosis}</p>
          </div>
          
          <div className='flex flex-col gap-1'>
            <h3 className='text-[#7e8086] text-sm'>Vital Signs</h3>
            <div>
              <p className='text-[#222B23FF] text-sm'>{medicalRecord?.vitalSigns}</p>
            </div>
          </div>
          
          <div className='flex flex-col gap-1 '>
            <h3 className='text-[#7e8086] text-sm'>Clinical Notes</h3>
            <div className='bg-[#F5F6F480] p-3 rounded-2xl'>
              <p className='text-[#959595] text-sm'>{medicalRecord?.notes}</p>
            </div>
          </div>

          <div className='flex flex-col gap-1 '>
            <h3 className='text-[#7e8086] text-sm'>Prescriptions</h3>  
              {medicalRecord?.preScriptions?.map((p, index) => (
                <MedicineCard
                  key={index}
                  name={p?.medicationName}
                  dosage={p?.dosage}
                  mode = "doctorview"
                  duration={p?.duration}
                  instructions={p?.instructions}
                  onDelete={async () => {

                  await onDeleteMedicine(
                    medicalRecord.medicalId,
                    p.id
                  );

                  setMedicalRecord(prev => ({
                    ...prev,
                    preScriptions: prev.preScriptions.filter(
                    item => item.id !== p.id
                  )
                }));
              }}

                  onEdit={() => {
                    setFormData({
                      open: true,
                      mode: MODES.EDIT_PRESCRIPTION,
                      patientId,
                      medicalHistoryId: medicalRecord.medicalId,
                      prescriptionId: p.id,
                      patientInfo,

                      medicationName: p.medicationName || "",
                      dosage: p.dosage || "",
                      duration: p.duration || "",
                      instructions: p.instructions || ""
                    });
                  }}
                />
              ))}
          </div>

        </div>
        
        <div className='bg-[#F7F8F7FF] flex items-center gap-2 justify-end py-4 px-2'>

          <button className='py-1 text-sm px-4 rounded-xl border border-[#4A5F4EFF] text-[#4A5F4EFF] flex flex-row items-center gap-2'
            onClick={() => {
              setFormData({
              open: true,
              mode: MODES.EDIT_HISTORY,
              patientId,
              medicalHistoryId: medicalRecord.medicalId,
              patientInfo,
              diagnosis: medicalRecord.diagnosis || "",
              vitalSigns: medicalRecord.vitalSigns || "",
              notes: medicalRecord.notes || "",
            });
            }}
          >
            <Pen size={16}/>
            Edit Record
          </button>

          <button className='py-1 text-sm px-4 rounded-xl border border-[#C97272FF] text-[#C97272FF] flex flex-row items-center gap-2'
            onClick={async () => { await onDeleteMedicalHistory( medicalRecord.medicalId);
              onClose();
            }}
          >
            <Trash2 size={16}/>
            Delete
          </button>

        </div>

      </div>
    </div>

    {formData.open && (
      <MedicalRecordForm
      formData={{...formData , patientId}}

      onUpdatedHistory={(updated) => {
        setMedicalRecord(prev => ({
        ...prev,
        diagnosis: updated.diagnosis,
        vitalSigns: updated.vitalSigns,
        notes: updated.notes,
      }));

        onUpdateMedicalHistory(updated);
      }}
      
      onUpdatePrescription={(medicalId, updatedPrescriptions) => {

        setMedicalRecord(prev => ({
        ...prev,
        preScriptions: updatedPrescriptions
      }));

      onUpdatePrescription(medicalId, updatedPrescriptions);
    }}
    
    onClose={() =>
      setFormData({
        open: false,
        mode: null,
        patientId: null,
        medicalHistoryId: null,
        prescriptionId: null,
        patientInfo: null
      })
    }
  />
)}
  
  
  </>
}
