import React from "react";
import PredictionPatientCard from "../PredictionPatientCard/PredictionPatientCard";
import PredictionDetails from "../PredictionDetails/PredictionDetails";
import DetailedMedicalRecord from "../DetailedMedicalRecord/DetailedMedicalRecord";
import { getInitials } from "../../helpers/getInitials";

export default function PredictionHistoryPanel({
  predictions,
  setSelectedPredictionId,
  setSelectedMedicalHistoryId,
  selectedPredictionId,
  selectedMedicalHistoryId,
  patient,
  patientId,
  handleDeleteMedicalHistory,
  handleDeleteMedicine,
  handelUpdateMedicalHistory,
  handelUpdatePrescription,
})

{
  
  return (
    <div className="mt-4 w-full">

      {/* Header */}
      <div className="bg-white w-full rounded-xl shadow px-5 py-2">
        <h1 className="text-[#1A2E1CFF] font-semibold">
          Prediction History
        </h1>
      </div>

      {/* Table header (hidden on mobile) */}
      <div className="hidden lg:block w-full pt-6 pb-3 px-5">
        <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1.2fr_1.5fr_2fr] uppercase text-[13px] text-[#2C3E2FFF] font-bold">
          <div>Patient</div>
          <div>Type</div>
          <div>Date</div>
          <div>Result</div>
          <div>Confidence</div>
          <div>Action</div>
        </div>
      </div>

      {/* CARDS GRID - FIXED */}
      <div className="flex flex-wrap lg:flex-col  gap-3 w-full px-2 md:px-2">
        {predictions.map((prediction, index) => (
          <div key={index} className="w-full md:w-[48%] lg:w-full">
            <PredictionPatientCard
              {...prediction}
              onViewDetails={() =>
                setSelectedPredictionId(prediction.id)
              }
              showMedical={(medicalHistoryId) =>
                setSelectedMedicalHistoryId(medicalHistoryId)
              }
            />
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedPredictionId && (
        <PredictionDetails
          predictionId={selectedPredictionId}
          onClose={() => setSelectedPredictionId(null)}
        />
      )}

      {selectedMedicalHistoryId && (
        <DetailedMedicalRecord
          medicalHistoryId={selectedMedicalHistoryId}
          patientId={patientId}
          onClose={() => setSelectedMedicalHistoryId(null)}
          onDeleteMedicalHistory={handleDeleteMedicalHistory}
          onDeleteMedicine={handleDeleteMedicine}
          onUpdateMedicalHistory={handelUpdateMedicalHistory}
          onUpdatePrescription={handelUpdatePrescription}
          patientInfo={{
            name: patient?.name,
            week: patient?.week,
            imageUrl: patient?.imageUrl,
            initials: getInitials(patient?.name),
          }}
        />
      )}
    </div>
  );
}