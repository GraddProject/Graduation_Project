import { useEffect, useState } from "react";
import axios from "axios";
import { Camera } from "lucide-react";

export default function MedicalProfileForm({
  mode,
  profile,
  user,
  onSuccess,
  onClose,
}) {
  const isCompleteMode = mode === "complete";

  const formattedDob = profile?.dateOfBirth
    ? new Date(profile.dateOfBirth).toISOString().slice(0, 10)
    : "";

  const [form, setForm] = useState({
    dateOfBirth: "",
    pregnancyStartDate: "",
    bloodType: "",
    height: "",
    weight: "",
    numberOfPregnancies: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (mode === "edit" && profile) {
      setForm({
        dateOfBirth: formattedDob,
        bloodType: profile.bloodType || "",
        height: profile.heightCm || "",
        weight: profile.weightKg || "",
        numberOfPregnancies: profile.numberOfPregnancies || "",
        pregnancyStartDate: "",
        profileImage: null,
      });

      setPreview(profile.profileImageUrl || null);
    }
  }, [mode, profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profileImage: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        data.append(key, form[key]);
      }
    });

    await axios.put(
      "https://her-journey-1044023551709.us-central1.run.app/api/Patient/CompleteMedicalProfile",
      data,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    onSuccess();
  };

  const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        {...props}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-DarkGreen"
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">

        <form className="p-4 sm:p-5 space-y-5" onSubmit={handleSubmit}>

          {/* TITLE */}
          <h2 className="text-center text-base sm:text-lg font-semibold text-[#313d32]">
            {isCompleteMode
              ? "Complete Your Medical Profile"
              : "Edit Your Medical Profile"}
          </h2>

          {/* IMAGE */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <img
                src={preview || profile?.profileImageUrl}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-DarkGreen"
              />

              <label className="absolute bottom-0 right-0 bg-DarkGreen text-white p-1 sm:p-1.5 rounded-full cursor-pointer text-xs">
                <Camera size={16} />
                <input type="file" hidden onChange={handleImage} />
              </label>
            </div>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />

            {isCompleteMode && (
              <Input
                label="Pregnancy Start Date"
                type="date"
                name="pregnancyStartDate"
                value={form.pregnancyStartDate}
                onChange={handleChange}
              />
            )}

            <Input
              label="Blood Type"
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
            />

            <Input
              label="Height (cm)"
              name="height"
              value={form.height}
              onChange={handleChange}
            />

            <Input
              label="Weight (kg)"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />

            <Input
              label="Number of Pregnancies"
              name="numberOfPregnancies"
              value={form.numberOfPregnancies}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-row gap-2 pt-2">

            <button
              type="submit"
              className="flex-1 bg-[#4A6B4EFF] text-white py-2.5 rounded-lg text-sm"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}