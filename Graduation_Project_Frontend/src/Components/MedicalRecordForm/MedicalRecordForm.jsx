import React from 'react'
import { Plus, X } from "lucide-react";
import Prescriptions from '../Prescriptions/Prescriptions';
import { useState , useEffect } from 'react';
import axios from 'axios';
import { UserContext } from "../../Components/context/User.context";
import { useContext } from 'react';
import { useParams } from "react-router-dom";
import { formatDate } from '../../helpers/formatDate';
import { MODES } from '../../helpers/medicalModes';

export default function MedicalRecordForm({ formData , onSuccess, onUpdatedHistory , onUpdatePrescription , onClose }) {

    const { token } = useContext(UserContext); 
    const [diagnosis, setDiagnosis] = useState("");
    const [vitalSigns, setVitalSigns] = useState("");
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [prescriptions, setPrescriptions] = useState(() => {
        if (formData.mode === MODES.EDIT_PRESCRIPTION) {
            return [
        {
            name: formData.medicationName || "",
            dosage: formData.dosage || "",
            duration: formData.duration || "",
            instruction: formData.instructions || "",
        },
        ];
        }
        return [];
    });
    const { id } = useParams();
    const patientInfo = formData.patientInfo;

    const isEditHistory = formData.mode === MODES.EDIT_HISTORY;
    const isEditPrescription = formData.mode === MODES.EDIT_PRESCRIPTION;


    async function addMedicalHistory() {
        try{
          const vitalSignsFormatted = `BP/HR: ${vitalSigns} | Weight: ${weight} kg`;
          const {data} = await axios.post( "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/AddMedicalHistory",
            {
                predictionRecordId: formData.mode === "PREDICTION" ? formData.predictionRecordId : null,
                diagnosis,
                vitalSigns: vitalSignsFormatted,
                notes,
                prescriptions: prescriptions.map(p=> ({
                    medicationName: p.name,
                    dosage: p.dosage,
                    duration: p.duration,
                    instructions: p.instruction
                })),
            },
            {  
                params: {patientId : id},
                headers: {Authorization: `Bearer ${token}`},
            })

        const newRecord = {
            medicalId: data.id,
            addDate: data.createdAt,
            diagnosis: data.diagnosis,
            vitalSigns: data.vitalSigns,
            notes: data.notes,
            preScriptions: data.preScriptions.map((p) => ({
            medicationName: p.medicationName,
            dosage: p.dosage,
            duration: p.duration,
            instructions: p.instructions,
            })),
        };

        onSuccess?.();
        onClose(); 
          
        } catch(error) {
            console.log(error);
        }    
    }

    async function updateMedicalHistory() {
      try{  
        const vitalSignsFormatted = `BP/HR: ${vitalSigns} | Weight: ${weight} kg`;
        const {data} = await axios.put(
           "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/UpdateMedicalHistory",
            {
                diagnosis,
                vitalSigns: vitalSignsFormatted,
                notes,
            },
            {
                params:{
                    PatientId : formData.patientId,
                    MedicalHistoryId: formData.medicalHistoryId
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        onUpdatedHistory(data);
       onClose();
    } catch(error){
        console.log(error)
    }
        
    }

    async function updatePrescription() {
    try {
    const p = prescriptions[0];

    const { data } = await axios.put(
      "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/UpdatePreScription",
      {
        medicationName: p.name,
        dosage: p.dosage,
        duration: p.duration,
        instructions: p.instruction,
      },
      {
        params: {
          PatientId: formData.patientId,
          MedicalHistoryId: formData.medicalHistoryId,
          PreScriptionId: formData.prescriptionId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    onUpdatePrescription(formData.medicalHistoryId, data.preScriptions);

    onClose();

  } catch (error) {
    console.log(error);
  }
    }

    useEffect(() => {
        if (formData.mode === MODES.EDIT_HISTORY) {
        setDiagnosis(formData.diagnosis || "");
        setNotes(formData.notes || "");

        const vs = formData.vitalSigns || "";
        const parts = vs.split("|").map(p => p.trim());

        const cleanVital = parts
         .filter(p => !p.toLowerCase().includes("weight"))
         .map(p => p.replace(/bp\/hr:\s*/i, "").trim())
         .join(" | ");

        setVitalSigns(cleanVital);

        const weightPart = parts.find(p =>
            p.toLowerCase().includes("weight")
        );

        const weightNumber = weightPart?.match(/\d+(\.\d+)?/);
        setWeight(weightNumber ? weightNumber[0] : "");
        }
    }, [formData]);
    
    return <>
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
        <div className='bg-white rounded-2xl shadow-[0px_2px_4px_#00000012] w-full max-w-lg px-4 py-5 max-h-[96vh] overflow-y-auto'>
            <div className='flex items-center justify-between pb-3 border-b '>
                <h2 className='text-smfont-bold'>{ formData.mode === MODES.CREATE || formData.mode === MODES.CREATE_FROM_PREDICTION  || formData.mode === MODES.PREDICTION ? "Add Medical Record" : formData.mode === MODES.EDIT_HISTORY ? "Edit Medical Record" : "Edit Prescription"}</h2>
                <div className="flex justify-end" onClick={() => onClose(false)}>
                    <X size={20} className="text-[#8A9A8AFF] cursor-pointer" />
                </div>
            </div>

            <div className="flex gap-3 items-center mt-4 px-3 py-2 bg-[#F3F4F666] border border-[ #DEE1E6FF] rounded-2xl"> 
                {patientInfo.imageUrl ?(
                    <img
                      src= {patientInfo.imageUrl}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"/>
                ): (
                    <div className="w-10 h-10 rounded-full bg-[#4A6B4E] flex items-center justify-center text-white font-bold">
                        {patientInfo?.initials}
                    </div>
                )}

                <div className='flex flex-col justify-center gpa-2'>
                    <span className="font-bold text-[#171A1FFF] text-[16px] ">
                        {patientInfo.name}
                    </span>
                    <span className='text-[#565D6DFF] text-sm'>Prenatal Care Path · Week {patientInfo.week}</span>
                </div>

            </div>
            { !isEditPrescription && (
            <div>
            <div className='flex flex-col gap-2 mt-5'>
                <h2 className='text-[#565D6DFF] text-[13px]'>DIAGNOSIS & CLINICAL OBSERVATION *</h2>
                <textarea 
                    className="p-2  bg-[#F5F6F480] border border-[#DEE1E6FF] rounded-lg h-24  resize-y focus:outline-none focus:border-[#DEE1E6FF] placeholder:text-xs" 
                    placeholder='Describe patient condition, vital observations, and any clinical notes...'
                    value={diagnosis}
                    onChange={(e)=>setDiagnosis(e.target.value)}  />
                    
            </div>

            <div className='flex flex-row items-center gap-4 w-full'>
                <div className='flex flex-col gap-2 mt-5 w-6/12'>
                    <h2 className='text-[#565D6DFF] text-[13px]' >VITAL SIGNS (BP/HR)</h2>
                    <input 
                       className='px-2 bg-[#F5F6F480] py-1 border border-[#DEE1E6FF] rounded-lg  focus:outline-none focus:border-[#DEE1E6FF] placeholder:text-xs' 
                       placeholder='e.g. 120/80 | 72'
                       type='text'
                       value={vitalSigns}
                       onChange={(e)=>{setVitalSigns(e.target.value)}}
                    />
                </div>

                <div className='flex flex-col gap-2 mt-5 w-6/12'>
                    <h2 className='text-[#565D6DFF] text-[13px]' >WEIGHT (KG)</h2>
                    <input 
                       className='px-2 bg-[#F5F6F480] py-1 border border-[#DEE1E6FF] rounded-lg  focus:outline-none focus:border-[#DEE1E6FF] placeholder:text-xs' 
                       placeholder='e.g. 68.5'
                       type='number'
                       value={weight}
                       onChange={(e)=>{setWeight(e.target.value)}}
                    />
                </div>

            </div>

            <div className='flex flex-col gap-2 mt-5'>
                <h2 className='text-[#565D6DFF] text-[13px]'>INTERNAL NOTES (PRIVATE)</h2>
                <textarea 
                className="p-2 bg-[#F5F6F480] border  border-[#DEE1E6FF] rounded-lg h-16 resize-y focus:outline-none focus:border-[#DEE1E6FF] placeholder:text-xs" 
                placeholder='Clinical reminders or sensitive notes...'
                value={notes}
                onChange={(e)=>{setNotes(e.target.value)}}
                 />
            </div>
            </div>
            )}
             { !isEditHistory && (
             <Prescriptions value={prescriptions} onChange={setPrescriptions}  isEditPrescription={isEditPrescription}/> 
              )}
            <div className='flex flex-row gap-3 mt-4'>
                <button className='w-8/12 bg-[#4A6B4EFF] text-white rounded-xl border-2 border-[#4A6B4EFF]  py-1 ' onClick={() => { switch (formData.mode) { case MODES.CREATE: case MODES.PREDICTION: addMedicalHistory(); break; case MODES.EDIT_HISTORY: updateMedicalHistory(); break; case MODES.EDIT_PRESCRIPTION: updatePrescription(); break; default: break; } }}>
                   { formData.mode === MODES.CREATE || formData.mode === MODES.CREATE_FROM_PREDICTION || formData.mode === MODES.PREDICTION ? "Save Medical Record" : "Save Updates"}
                </button >

                <button onClick={() => onClose(false)} className='w-4/12 bg-[#F3F4F6FF] text-[#565D6DFF] rounded-xl font-medium border-2  px-2  py-1 '>
                    Cancle 
                </button >

            </div>    


        </div>
        

    </div>
  
  
  </>
}
