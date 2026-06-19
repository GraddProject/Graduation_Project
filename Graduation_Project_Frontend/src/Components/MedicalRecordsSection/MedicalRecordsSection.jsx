import React, { useMemo } from "react";
import { Stethoscope, Plus } from "lucide-react";
import MedicalRecordForm from "../MedicalRecordForm/MedicalRecordForm";
import MedicalHistoryCard from "../MedicalHistoryCard/MedicalHistoryCard";
import { MODES } from "../../helpers/medicalModes";
import { getInitials } from "../../helpers/getInitials";

export default function MedicalRecordsSection({ medicalHistory, patient, id, formData, setFormData, handleAddMedicalHistory, handelUpdateMedicalHistory, handelUpdatePrescription, handleDeleteMedicalHistory,handleDeleteMedicine,}) {
  

  const flatMedicalHistory = useMemo(() => {
    return medicalHistory?.flatMap((group) => group.items) || [];
  }, [medicalHistory]);

  const totalRecords = flatMedicalHistory.length;

  return (
    <div className="w-full sm:w-7/12">

      <div className="flex flex-row justify-between items-center">

        <div className="flex flex-row gap-2 items-center">
          <Stethoscope size={20} className="text-[#4A5F4EFF]" />

          <h2 className="text-[#1A2E1CFF]">Medical Records</h2>

          <div className="px-2 py-1 rounded-2xl bg-[#E8F5E8FF]">
            <p className="text-[#667E68FF] font-semibold text-sm">
              {totalRecords}
            </p>
          </div>
        </div>

        <div
          className="flex flex-row items-center gap-1 cursor-pointer"
          onClick={() =>
            setFormData({
              open: true,
              mode: MODES.CREATE,
              patientId: patient.id,
              patientInfo: {
                name: patient.name,
                week: patient.week,
                imageUrl: patient.imageUrl || null,
                initials: getInitials(patient.name),
              },
            })
          }
        >
          <Plus size={15} strokeWidth={3} className="text-[#4A5F4EFF]" />
          <h3 className="text-[#4A5F4EFF] font-semibold text-sm">
            Add Record
          </h3>
        </div>
      </div>

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
              patientId: id,
              predictionRecordId: null,
              patientInfo: null,
            })
          }
        />
      )}

      <div className="flex flex-col gap-4 mt-4">
        {flatMedicalHistory.map((history) => (
          <MedicalHistoryCard
            key={history.medicalId}
            mode="doctorview"
            MedicalHistory={{
              addDate: history.addDate,
              diagnosis: history.diagnosis,
              vitalSigns: history.vitalSigns,
              notes: history.notes,
              prediction: history.prediction,
              preScriptions: history.prescriptions,
            }}
            PatientId={id}
            MedicalId={history.medicalId}
            onDelete={handleDeleteMedicalHistory}
            onDeleteMedicine={handleDeleteMedicine}
            setFormData={setFormData}
            patientInfo={{
              name: patient.name,
              imageUrl: patient.imageUrl,
              initials: getInitials(patient.name),
            }}
          />
        ))}
      </div>

    </div>
  );
}