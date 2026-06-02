import axios from "axios";

const BASE_URL = "https://her-journey-1044023551709.us-central1.run.app";


export const deleteMedicalHistory = async (token, patientId, medicalId) => {
  return await axios.delete(
    `${BASE_URL}/api/Doctor/patients/${patientId}/medical-histories/${medicalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const deleteMedicine = async (token, patientId, medicalId, prescriptionId) => {
  return await axios.delete(
    `${BASE_URL}/api/Doctor/patients/${patientId}/medical-histories/${medicalId}/prescriptions/${prescriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateMedicalHistoryLocal = (prev, updated) => {
  return prev.map(item =>
    item.medicalHistoryId === updated.id
      ? {
          ...item,
          diagnosis: updated.diagnosis,
          vitalSigns: updated.vitalSigns,
          notes: updated.notes,
        }
      : item
  );
};