import React from "react";
import { HeartPulse } from "lucide-react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { MODES } from "../../helpers/medicalModes";
import { getInitials } from "../../helpers/getInitials";
import MedicalRecordForm from "../MedicalRecordForm/MedicalRecordForm";

export default function PredictionResultCard({
  predictionResult,
  levelStyle,
  patient,
  patientId,
  predictionRecordId,
  setFormData,
  formData,
  handelUpdateMedicalHistory,
  handelUpdatePrescription,
  handleAddMedicalHistory,
  type, // 👈 GDM | PE
}) {

  const modelLabel =
    type === "GDM"
      ? "Gestational Diabetes"
      : type === "PE"
      ? "Preeclampsia"
      : "Prediction";

  const description =
    type === "GDM"
      ? "Glucose intolerance risk assessment during pregnancy"
      : type === "PE"
      ? "Hypertension and organ damage risk assessment"
      : "Risk assessment based on clinical data";

  return (
    <div className="bg-white w-full lg:w-5/12 rounded-xl shadow mt-3 px-5 py-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#1A2E1CFF] font-semibold">
          Prediction Result
        </h1>

        {predictionResult?.result && (
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              color: levelStyle.color,
              background: levelStyle.bg,
              border:` 1px solid ${levelStyle.border}`,
            }}
          >
            {modelLabel} Analysis Complete
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {!predictionResult?.result ? (
        <div className="flex flex-col items-center justify-center h-[420px]">
          <div className="w-24 h-24 rounded-full bg-[#F4FBF4] flex items-center justify-center">
            <HeartPulse size={42} className="text-[#4A6B4E]" />
          </div>

          <h2 className="mt-6 text-lg font-semibold text-[#1A2E1CFF]">
            No Prediction Generated
          </h2>

          <p className="text-sm text-[#9095A1] text-center mt-2 max-w-[300px] leading-6">
            {description}
          </p>

          <div className="mt-8 px-4 py-2 rounded-xl bg-[#F7F9F7] border border-[#E8EBE8]">
            <span className="text-[#4A6B4E] text-sm font-medium">
              Waiting for analysis...
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* RISK CIRCLE */}
          <div
            className="w-28 h-28 rounded-full border-[5px] mx-auto mt-8 flex items-center justify-center"
            style={{
              borderColor: levelStyle.border,
              background: levelStyle.bg,
            }}
          >
            <p
              className="text-center font-semibold uppercase text-[13px]"
              style={{ color: levelStyle.color }}
            >
              {levelStyle.text}
            </p>
          </div>

          {/* RESULT */}
          <div className="text-center mt-6">
            <h2
              className="font-bold text-xl"
              style={{ color: levelStyle.color }}
            >
              {predictionResult.result}
            </h2>

            <p className="text-sm text-[#9095A1] mt-2">
              {modelLabel} Risk Assessment
            </p>
          </div>

          {/* CONFIDENCE */}
          <div className="mt-8 bg-[#F7F9F7] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#565D6D]">Confidence Level</span>

              <span
                className="font-bold"
                style={{ color: levelStyle.color }}
              >
                {predictionResult.confidence}%
              </span>
            </div>

            <ProgressBar
              width="full"
              value={predictionResult.confidence}
              color={levelStyle.progress}
            />
          </div>
          {/* STATUS */}
          <div className="flex flex-row items-center justify-center gap-2 bg-[#F4FBF4] text-[#3d5a41] rounded-lg mt-4 font-medium py-3">
            <div className="w-3 h-3 rounded-full bg-[#8fa190]"></div>
            Model Analysis Completed Successfully
          </div>

          {/* BUTTON */}
          <div className="flex flex-col items-center gap-2 mt-5">
            <button
              onClick={() =>
                setFormData({
                  open: true,
                  mode: MODES.PREDICTION,
                  patientId: patient?.id,
                  predictionRecordId: predictionRecordId,
                  patientInfo: {
                    name: patient.name,
                    week: patient.week,
                    imageUrl: patient.imageUrl || null,
                    initials: getInitials(patient.name),
                  },
                })
              }
              className="w-full bg-[#4A6B4EFF] text-white rounded-xl font-medium py-2.5 hover:opacity-90 transition"
            >
              Add Diagnosis
            </button>
          </div>
        </>
      )}

      {/* FORM */}
      {formData.open && (
        <MedicalRecordForm
          formData={formData}
          onUpdatedHistory={handelUpdateMedicalHistory}
          onUpdatePrescription={handelUpdatePrescription}
          onSuccess={handleAddMedicalHistory}
          onClose={() =>
            setFormData({
              open: false,
              mode: null,
              patientId: patientId,
              predictionRecordId: null,
              patientInfo: null,
            })
          }
        />
      )}
    </div>
  );
}