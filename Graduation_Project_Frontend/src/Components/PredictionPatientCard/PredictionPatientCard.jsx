import React from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function PredictionPatientCard({
  patientImage,
  patientName,
  patientId,
  predicationType,
  predicationDate,
  predicationConfidence,
  onViewDetails,
  showMedical,
  medicalHistoryId,
}) {


  const [showNoHistoryModal, setShowNoHistoryModal] = useState(false);
  const navigate = useNavigate();

  const getLevelFromConfidence = (confidence) => {
    const value = Number(confidence);

    if (value >= 70) return "high";
    if (value >= 40) return "medium";
    if (value > 0) return "low";
    return null;
  };

  const riskLevel = getLevelFromConfidence(predicationConfidence);

  const color =
    riskLevel === "low"
      ? "#4A6B4EFF"
      : riskLevel === "medium"
      ? "#DAA520FF"
      : "#C97272FF";

  const lightColor =
    riskLevel === "low"
      ? "#F4FBF4FF"
      : riskLevel === "medium"
      ? "#E8C5B11A"
      : "#D7263D1A";

  return (
    <div className='bg-white w-full rounded-xl shadow mt-2 pl-5 py-2 grid grid-cols-[1.4fr_1.2fr_1fr_1.2fr_1.5fr_2fr] items-center'>

      <div className="flex gap-3 items-center cursor-pointer" onClick={() => navigate(`/doctor/patient-profile/${patientId}`)}> 
        <img
          src={patientImage}
          className="w-10 h-10 rounded-full"
        />

        <span className="font-bold text-[#2C3E2F] text-sm">
          {patientName}
        </span>
      </div>

      <div
        className="rounded-3xl py-1 px-3 w-fit border border-[#E0E4E0FF]"
        style={{ background: lightColor }}
      >
        <p className='text-sm' style={{ color }}>
          {predicationType}
        </p>
      </div>

      <div>
        <p className='text-[#6B7E6DFF] text-sm'>
          {predicationDate}
        </p>
      </div>

      <div className="flex flex-row gap-2 items-center">    
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className='font-semibold text-sm capitalize' style={{ color }}>
          {riskLevel ? riskLevel : "NO"} Risk
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <ProgressBar width={120} value={predicationConfidence} />
        <span className='text-[#4A6B4EFF] text-sm font-semibold'>
          {predicationConfidence}%
        </span>
      </div>

      <div className='flex flex-row gap-7'>
        <button className="w-fit text-[#4A6B4EFF] font-medium py-2 rounded-xl" onClick={onViewDetails}>
          View Details
        </button>
        
        <button className="w-fit text-[#4A6B4EFF] font-medium py-2 rounded-xl" onClick={() => {
          if (!medicalHistoryId) {
            setShowNoHistoryModal(true);
            return;
          }
          showMedical(medicalHistoryId , patientId);
          }} >
          Medical History
        </button>
      </div>
      {
    showNoHistoryModal && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm pt-4 pb-4 px-3">
        <p className="text-sm text-[#565D6DFF] text-center mt-2">
          No medical history linked to this prediction yet.
        </p>

        <div className="flex justify-center mt-5 ">
          <button
            onClick={() => setShowNoHistoryModal(false)}
            className="bg-[#4A6B4EFF] text-white text-sm px-5 py-1 rounded-xl"
          >
            OK
          </button>
        </div>

      </div>

    </div>
  )
}

    </div>
  );
}

