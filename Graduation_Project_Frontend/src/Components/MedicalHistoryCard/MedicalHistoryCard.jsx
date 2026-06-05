import React from 'react'
import { Stethoscope , PenLine , Trash2 } from 'lucide-react'
import MedicineCard from '../MedicineCard/MedicineCard'
import { useState } from 'react';
import { formatDate } from '../../helpers/formatDate';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/User.context';
import { MODES } from '../../helpers/medicalModes';
import ProgressBar from "../../Components/ProgressBar/ProgressBar"


export default function MedicalHistoryCard({mode ,  MedicalHistory , PatientId , MedicalId , onDelete , onDeleteMedicine , setFormData  , patientInfo   }) {

 
  const {addDate , diagnosis , vitalSigns , notes , preScriptions =[] , prediction} = MedicalHistory;
  const {token} = useContext(UserContext);

  const riskStyles = {
   "Low Risk": {
    color: "#4A6B4E",
    backgroundColor: "#E6F4EA",
  },
   "Moderate Risk" : {
    color: "#DAA520FF",
    backgroundColor: "#fff8de",
  },
   "High Risk": {
    color: "#D7263D",
    backgroundColor: "#FDEAEA",
  },
};


  function handleMedicalHistoryDelete() {
    onDelete(MedicalId);
  }

  return <>
    <div className='bg-white rounded-xl shadow mt-3  flex overflow-hidden'>
        <div className="w-[2px] bg-[#5A8A5DFF]"></div>
            <div className='flex flex-col w-full px-3 py-5 '>          
                <div className='flex flex-row items-center justify-between w-full border-b-[1px] border-b-[#E8EBE8FF]  pb-5' >
                    <div className='flex flex-row items-center gap-2'>
                        <div className='w-10 h-10 rounded-full bg-[#E8F5E8FF] flex items-center justify-center'>
                            <Stethoscope size={20} className='text-[#5A8A5DFF]' />
                        </div>
                        <span className='text-[#9196A1FF] text-sm font-medium'>{formatDate(addDate)}</span>
                    </div>
                   
                    { mode === "doctorview" && 
                    <div className='flex flex-row items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-[#F3F4F6FF] flex items-center justify-center cursor-pointer'
                             onClick={()=>{setFormData({open:true , mode: MODES.EDIT_HISTORY , patientId: PatientId , medicalHistoryId:MedicalId , diagnosis , vitalSigns , notes  , patientInfo: patientInfo })}}>
                            <PenLine size={17} className='text-[#9196A1FF]' />
                        </div>
                        <div 
                            className='w-8 h-8 rounded-full bg-[#FFF5F5FF] flex items-center justify-center cursor-pointer'
                            onClick={handleMedicalHistoryDelete}>
                            <Trash2 size={17} className='text-[#C97272FF]' />
                        </div>
                    </div>
                    }
                </div>
                
                <div className='flex flex-col gap-1 border-b-[1px] border-b-[#E8EBE8FF] pb-5 '>
                    <div>
                        <h3 className='text-[#6a796b] mt-4 uppercase text-xs font-semibold'>Diagnosis</h3>
                        <p className='text-[#617062e2] leading-6 mt-1 font-[550] text-sm'>
                           {diagnosis}
                        </p>
                    </div>
                    <div>
                        <h3 className='text-[#6a796b] mt-4 uppercase text-xs font-semibold'>Vital Signs</h3>
                        <p className='text-[#617062e2] mt-1 font-[550] text-sm'>{vitalSigns}</p>
                    </div>

                    <p className='mt-3 text-[#7A8F7CFF]  text-xs '>{notes}</p>
                </div>

                { prediction && <div className=' bg-[#F7F9F7FF] rounded-xl flex flex-col gap-4 my-2 px-3 py-3'>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-center gap-2'> 
                            <h3 className='text-[#6a796b] text-xs font-semibold'>Risk Analysis:</h3>
                            <div className='px-2 text-xs rounded-xl' style={riskStyles[prediction.riskLevel]} >
                                {prediction.riskLevel}
                            </div>
                            <p className='text-xs text-[#4A5F4EFF] '>Confidence: {prediction.confidencePercentage} %</p>
                        </div>
                        <p className='text-xs text-[#4A5F4EFF] mr-4 '>
                            Type: {prediction.type}
                        </p>
                    </div>  

                    <ProgressBar width='full' value={prediction.confidencePercentage} />              
                   </div>

                }

                { preScriptions.length != 0 &&
                <div className='flex flex-col gap-2 border-t-[1px] border-b-[#E8EBE8FF]'>
                    <h3 className='text-[#6a796b] mt-4 uppercase text-xs font-semibold'>Prescriptions</h3>
                    <div className='flex flex-wrap gap-2'>
                        {preScriptions.map((p, index) => (
                        <MedicineCard
                            key={index}
                            name={p.medicationName}
                            dosage={p.dosage}
                            duration={p.duration}
                            instructions={p.instructions}
                            onDelete={() => onDeleteMedicine(MedicalId, p.id)}
                            mode = {mode}
                            
                            onEdit={() =>
                                setFormData({
                                open: true,
                                mode: MODES.EDIT_PRESCRIPTION,
                                patientId: PatientId,
                                medicalHistoryId: MedicalId,
                                prescriptionId: p.id,
                                medicationName: p.medicationName ,
                                dosage: p.dosage,
                                duration: p.duration,
                                instructions: p.instructions,
                                patientInfo: patientInfo
                                })
                            }
                            />
                        ))} 
                    </div>
                </div>
                }
            </div>
    </div>
  
  
  
  </>
}
