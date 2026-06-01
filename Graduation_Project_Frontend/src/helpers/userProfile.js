import axios from "axios";

export async function getDoctorProfile(token) {
  const res = await axios.get(
    "https://her-journey-1044023551709.us-central1.run.app/api/Doctor/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

export async function getPatientProfile(token){
  const res = await axios.get(
    "https://her-journey-1044023551709.us-central1.run.app/api/Patient/Profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}