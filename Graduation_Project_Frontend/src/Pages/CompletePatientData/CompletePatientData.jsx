import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useLocation } from "react-router-dom";

/* ---------------- UI ---------------- */


const email = location.state?.email || "";
const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-sm border p-5">
    {children}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
      value ? "bg-[#4A5F4E]" : "bg-gray-300"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow transition ${
        value ? "translate-x-6" : ""
      }`}
    />
  </button>
);

/* ---------------- PAGE ---------------- */

export default function CompleteMedicalProfilePage() {
  
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        "https://her-journey-1044023551709.us-central1.run.app/api/Patient/Profile",
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      setForm(data);
      setLoading(false);
    };

    fetch();
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- SAVE ---------------- */

  const normalizeBoolean = (v) => v === true;

const saveProfile = async () => {
  const params = {
    DateOfBirth: form.dateOfBirth,
    PregnancyStartDate: form.pregnancyStartDate,
    BloodType: form.bloodType,
    Height: form.heightCm,
    Weight: form.weightKg,
    NumberOfPregnancies: form.numberOfPregnancies || 0,

    HadGestationalDiabetesBefore: normalizeBoolean(form.HadGestationalDiabetesBefore),
    HasFamilyHistoryOfDiabetes: normalizeBoolean(form.HasFamilyHistoryOfDiabetes),
    HadUnexplainedPrenatalLoss: normalizeBoolean(form.HadUnexplainedPrenatalLoss),
    HadLargeChildOrBirthDefault: normalizeBoolean(form.HadLargeChildOrBirthDefault),
    HasPCOS: normalizeBoolean(form.HasPCOS),
    HasSedentaryLifestyle: normalizeBoolean(form.HasSedentaryLifestyle),
    HasPrediabetes: normalizeBoolean(form.HasPrediabetes),

    Gravida: form.Gravida || 0,
    Parity: form.Parity || 0,

    HasChronicHypertension: normalizeBoolean(form.HasChronicHypertension),
    HasPregestationalDiabetes: normalizeBoolean(form.HasPregestationalDiabetes),
    HasChronicKidneyDisease: normalizeBoolean(form.HasChronicKidneyDisease),
    HadPreviousPreeclampsia: normalizeBoolean(form.HadPreviousPreeclampsia),
    HasFamilyHistoryOfPreeclampsia: normalizeBoolean(form.HasFamilyHistoryOfPreeclampsia),
  };

  // 🚨 مهم جدًا: remove undefined/null
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
  );

  const query = new URLSearchParams(cleanParams).toString();

  const formData = new FormData();
  if (image) formData.append("ProfileImage", image);

  await axios.put(
    `https://her-journey-1044023551709.us-central1.run.app/api/Patient/CompleteMedicalProfile?${query}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  navigate("/login");
};

  if (loading || !form) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  /* ---------------- FIELD DEFINITIONS (WITH DESCRIPTIONS) ---------------- */

  const basicInputs = [
    { key: "dateOfBirth", type: "date", label: "Date of Birth" },
    { key: "pregnancyStartDate", type: "date", label: "Pregnancy Start Date" },
    { key: "bloodType", type: "text", label: "Blood Type" },
    { key: "heightCm", type: "number", label: "Height (cm)" },
    { key: "weightKg", type: "number", label: "Weight (kg)" },
    { key: "numberOfPregnancies", type: "number", label: "Number of Pregnancies" },
  ];

  const booleanFields = [
    {
      key: "HadGestationalDiabetesBefore",
      label: "Previous Gestational Diabetes",
      description:
        "Indicates whether the patient was diagnosed with gestational diabetes in a previous pregnancy.",
    },
    {
      key: "HasFamilyHistoryOfDiabetes",
      label: "Family History of Diabetes",
      description:
        "Indicates whether the patient has a family history of diabetes, such as parents or siblings.",
    },
    {
      key: "HadUnexplainedPrenatalLoss",
      label: "Unexplained Prenatal Loss",
      description:
        "Indicates whether the patient had a previous pregnancy loss without a clear medical reason.",
    },
    {
      key: "HadLargeChildOrBirthDefault",
      label: "Large Child or Birth Default",
      description:
        "Indicates whether the patient previously delivered a large baby or had a birth-related abnormality.",
    },
    {
      key: "HasPCOS",
      label: "PCOS",
      description:
        "Indicates whether the patient has been diagnosed with polycystic ovary syndrome.",
    },
    {
      key: "HasSedentaryLifestyle",
      label: "Sedentary Lifestyle",
      description:
        "Indicates whether the patient has a low-activity lifestyle or does not exercise regularly.",
    },
    {
      key: "HasPrediabetes",
      label: "Prediabetes",
      description:
        "Indicates whether the patient has been diagnosed with prediabetes or high blood sugar before diabetes.",
    },
    {
      key: "HasChronicHypertension",
      label: "Chronic Hypertension",
      description:
        "Indicates whether the patient has chronic high blood pressure before pregnancy or early in pregnancy.",
    },
    {
      key: "HasPregestationalDiabetes",
      label: "Pregestational Diabetes",
      description:
        "Indicates whether the patient had diabetes before becoming pregnant.",
    },
    {
      key: "HasChronicKidneyDisease",
      label: "Chronic Kidney Disease",
      description:
        "Indicates whether the patient has chronic kidney disease.",
    },
    {
      key: "HadPreviousPreeclampsia",
      label: "Previous Preeclampsia",
      description:
        "Indicates whether the patient was diagnosed with preeclampsia in a previous pregnancy.",
    },
    {
      key: "HasFamilyHistoryOfPreeclampsia",
      label: "Family History of Preeclampsia",
      description:
        "Indicates whether the patient has a family history of preeclampsia, such as mother or sister.",
    },
  ];

  const numericFields = [
    {
      key: "Gravida",
      label: "Gravida",
      description:
        "Total number of pregnancies, including the current pregnancy.",
    },
    {
      key: "Parity",
      label: "Parity",
      description:
        "Number of previous pregnancies that reached a viable birth stage.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f9f6] p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-[#2C3E2F] text-white p-6 rounded-2xl text-center">
          <h1 className="text-2xl font-bold">
            Complete Your Medical Profile
          </h1>
          <p className="text-sm text-gray-200 mt-2">
            Fill your medical information to activate prediction system
          </p>
        </div>

        {/* PROFILE */}
        <Card>
          <div className="flex items-center justify-between gap-4">

            <div className="relative">
              <img
                src={image ? URL.createObjectURL(image) : form.profileImageUrl}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#E8F0EA]"
              />

              <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer">
                <Pencil size={14} />
                <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
              </label>
            </div>

            <div className="flex-1 ">
              {/* <h2 className="text-xl font-bold text-[#2C3E2F]">
                {form.displayName}
              </h2> */}
              <p className="text-gray-500">{email}</p>
            </div>

            <button
              onClick={saveProfile}
              className="bg-[#2C3E2F] text-white px-5 py-2 rounded-xl"
            >
              Save
            </button>

          </div>
        </Card>

        {/* BASIC INPUTS */}
        <Card>
          <h3 className="font-bold text-[#2C3E2F] mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {basicInputs.map((f) => (
              <div key={f.key}>
                <p className="text-sm font-semibold">{f.label}</p>
                <input
                  type={f.type}
                  value={form[f.key] || ""}
                  onChange={(e) =>
                    update(
                      f.key,
                      f.type === "number" ? +e.target.value : e.target.value
                    )
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* BOOLEAN FACTORS */}
        <Card>
          <h3 className="font-bold text-[#2C3E2F] mb-4">
            Medical Risk Factors (Yes / No)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {booleanFields.map((field) => (
              <div
                key={field.key}
                className="flex justify-between items-center border rounded-xl p-4 bg-gray-50"
              >
                <div className="w-9/12">
                  <p className="text-sm font-semibold mb-2">{field.label}</p>
                  <p className="text-xs text-gray-500">
                    {field.description}
                  </p>
                </div>

                <Toggle
                  value={form[field.key]}
                  onChange={(v) => update(field.key, v)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* NUMERIC CLINICAL */}
        <Card>
          <h3 className="font-bold text-[#2C3E2F] mb-4">
            Clinical Numbers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {numericFields.map((field) => (
              <div key={field.key}>
                <p className="text-sm font-semibold mb-2">{field.label}</p>
                <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                <input
                  type="number"
                  value={form[field.key] || 0}
                  onChange={(e) => update(field.key, +e.target.value)}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}