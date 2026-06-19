import React, { useState } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useNavigate } from "react-router-dom";

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
    if (value >= 50) return "medium";
    if (value > 0) return "low";
    return null;
  };

  const riskLevel = getLevelFromConfidence(predicationConfidence);

  const color =
    riskLevel === "low"
      ? "#4A6B4E"
      : riskLevel === "medium"
      ? "#DAA520FF"
      : "#D7263D";

  const lightColor =
    riskLevel === "low"
      ? "#E6F4EA"
      : riskLevel === "medium"
      ? "#fff8de"
      : "#FDEAEA";

  return (
    <div className="bg-white w-full rounded-xl shadow mt-2 p-4 flex flex-col">

      <div className="hidden lg:grid grid-cols-[1.4fr_1.2fr_1fr_1.2fr_1.5fr_2fr] items-center w-full">

        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => navigate(`/doctor/patient-profile/${patientId}`)}
        >
          <img src={patientImage} className="w-10 h-10 rounded-full" />
          <span className="font-bold text-[#2C3E2F] text-sm">
            {patientName}
          </span>
        </div>

        <div
          className="rounded-3xl py-1 px-3 w-fit border border-[#E0E4E0FF]"
          style={{ background: lightColor }}
        >
          <p className="text-sm" style={{ color }}>
            {predicationType}
          </p>
        </div>

        <p className="text-[#6B7E6DFF] text-sm">{predicationDate}</p>

        <div className="flex flex-row gap-2 items-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <p className="font-semibold text-sm capitalize" style={{ color }}>
            {riskLevel ? riskLevel : "NO"} Risk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ProgressBar width={120} value={predicationConfidence} />
          <span className="text-[#4A6B4EFF] text-sm font-semibold">
            {predicationConfidence}%
          </span>
        </div>

        <div className="flex flex-row gap-5">
          <button
            className="text-[#4A6B4EFF] font-medium"
            onClick={onViewDetails}
          >
            View Details
          </button>

          <button
            className="text-[#4A6B4EFF] font-medium"
            onClick={() => {
              if (!medicalHistoryId) {
                setShowNoHistoryModal(true);
                return;
              }
              showMedical(medicalHistoryId, patientId);
            }}
          >
            Medical History
          </button>
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-3">

        <div
          className="flex items-center justify-between"
          onClick={() => navigate(`/doctor/patient-profile/${patientId}`)}
        >
          <div className="flex gap-3 items-center">
            <img src={patientImage} className="w-10 h-10 rounded-full" />
            <span className="font-bold text-[#2C3E2F] text-sm">
              {patientName}
            </span>
          </div>

          <div
            className="rounded-3xl py-1 px-3 border"
            style={{ background: lightColor, color }}
          >
            {predicationType}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#6B7E6DFF]">{predicationDate}</span>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-semibold capitalize" style={{ color }}>
              {riskLevel} Risk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProgressBar width={120} value={predicationConfidence} />
          <span className="text-[#4A6B4EFF] text-sm font-semibold">
            {predicationConfidence}%
          </span>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            className="text-[#4A6B4EFF] font-medium"
            onClick={onViewDetails}
          >
            View Details
          </button>

          <button
            className="text-[#4A6B4EFF] font-medium"
            onClick={() => {
              if (!medicalHistoryId) {
                setShowNoHistoryModal(true);
                return;
              }
              showMedical(medicalHistoryId, patientId);
            }}
          >
            Medical History
          </button>
        </div>
      </div>

      {showNoHistoryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-4">
            <p className="text-sm text-[#565D6DFF] text-center">
              No medical history linked to this prediction yet.
            </p>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowNoHistoryModal(false)}
                className="bg-[#4A6B4EFF] text-white text-sm px-5 py-1 rounded-xl"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}