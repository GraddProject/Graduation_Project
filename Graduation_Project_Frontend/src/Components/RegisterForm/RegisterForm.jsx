import { useState, useContext, useEffect, useRef } from "react";
import RoleCard from "../RoleCard/RoleCard";
import InputField from "../InputField/InputField";
import { useFormik } from "formik";
import { UserContext } from "../../Components/context/User.context";
import { object, string, number } from "yup";
import { User, Mail, Phone, Stethoscope, Check } from "lucide-react";
import axios from "axios";

const BASE_URL = "https://her-journey-161730893876.us-central1.run.app/api/Admin";

function DoctorSearchSelect({ doctors, value, onChange, onBlur, error, touched }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filtered = doctors.filter((doc) =>
    doc.displayName.toLowerCase().includes(search.toLowerCase())
  );
  const selected = doctors.find((doc) => String(doc.id) === String(value));

  useEffect(() => {
    if (selected) setSearch(selected.displayName);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (!selected) setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  function handleSelect(doc) {
    onChange({ target: { name: "doctor", value: String(doc.id) } });
    setSearch(doc.displayName);
    setIsOpen(false);
  }

  function handleInputChange(e) {
    setSearch(e.target.value);
    setIsOpen(true);
    onChange({ target: { name: "doctor", value: "" } });
  }

  return (
    <div className="col-span-1 sm:col-span-2 flex flex-col gap-1" ref={containerRef}>
      <div className={`flex items-center border rounded-xl px-3 py-3 transition-all duration-200 bg-white
        ${isOpen ? "border-DarkGreen" : "border-primary-900"}
        ${touched && error ? "border-red-400" : ""}`}
      >
        <Stethoscope size={16} className="text-DarkGray shrink-0" />
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={onBlur}
          placeholder="Search doctor by name..."
          className="flex-1 mx-3 outline-none text-[11px] text-textColor placeholder-DarkGray/40 bg-transparent"
        />
        {selected && <Check size={14} className="text-DarkGreen shrink-0" />}
      </div>

      {isOpen && search.length > 0 && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 bg-white border border-primary-900 rounded-xl shadow-[0_8px_24px_rgba(102,126,104,0.15)] overflow-hidden">
            <div className="max-h-[180px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-[11px] text-DarkGray/50 text-center">No doctors found</div>
              ) : (
                filtered.map((doc) => (
                  <div
                    key={doc.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(doc)}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-[11px]
                      ${String(value) === String(doc.id)
                        ? "bg-DarkGreen/5 text-DarkGreen font-semibold"
                        : "text-textColor hover:bg-gray-50"}`}
                  >
                    <span>{doc.displayName}</span>
                    {String(value) === String(doc.id) && <Check size={13} className="text-DarkGreen shrink-0" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {touched && error && (
        <p className="text-red-700/60 text-xs mt-1">*{error}</p>
      )}
    </div>
  );
}

export default function RegisterForm() {
  const [role, setRole] = useState("patient");
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctors, setDoctors] = useState([]);
  let { token } = useContext(UserContext);

  const validationSchema = object({
    displayName: string().required("Display name is required"),
    email: string().email("Invalid email").required("Email is required"),
    phone: string().required("Phone is required"),
    experience: role === "doctor" ? number().required("Years of experience required") : number(),
    doctor: role === "patient" ? string().required("Please select a doctor") : string(),
  });

  async function getDoctorsList() {
    try {
      const { data } = await axios.request({
        url: `${BASE_URL}/DoctorsList`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  }

  useEffect(() => {
    if (role === "patient" && token) getDoctorsList();
  }, [role, token]);

 async function registerPatient(values) {
  try {
    const { data } = await axios.request({
      url: `${BASE_URL}/RegisterPatient`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        displayName: values.displayName,
        email: values.email,
        phoneNumber: values.phone,
        doctorId: Number(values.doctor),
      },
    });
    return data;
  } catch (error) {
    console.log("Request data sent:", {        
      displayName: values.displayName,
      email: values.email,
      phoneNumber: values.phone,
      doctorId: Number(values.doctor),
    });
    console.log("Validation errors:", error.response?.data?.validationErrors);
    throw error;
  }
}

  async function registerDoctor(values) {
    const { data } = await axios.request({
      url: `${BASE_URL}/RegisterDoctor`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        displayName: values.displayName,
        email: values.email,
        phoneNumber: values.phone,
        yearsOfExperience: Number(values.experience),
      },
    });
    return data;
  }

  async function handleSubmit(values) {
    setApiError("");
    setSuccess("");
    try {
      role === "patient" ? await registerPatient(values) : await registerDoctor(values);
      setSuccess(`${role === "patient" ? "Patient" : "Doctor"} account created! Activation email sent.`);
      formik.resetForm();
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
        error.response?.data?.[0]?.description ||
        "Something went wrong, please try again."
      );
    }
  }

  const formik = useFormik({
    initialValues: { displayName: "", email: "", phone: "", experience: "", doctor: "" },
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  return (
    <div className="relative flex flex-col mt-10 py-6 px-4 sm:px-6 md:px-6 lg:px-8 mx-auto bg-white rounded-[11px] shadow-[0_10px_40px_#00000014] w-full max-w-[480px] md:max-w-[650px]">
      <h1 className="text-[12px] font-bold text-[#2C3E2F] uppercase">
        Select User Role
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mt-3 items-center justify-center">
        <RoleCard
          title="Patient"
          description="Regular medical user"
          icon={User}
          active={role === "patient"}
          onClick={() => { setRole("patient"); formik.resetForm(); }}
        />
        <RoleCard
          title="Doctor"
          description="Medical practitioner"
          icon={Stethoscope}
          active={role === "doctor"}
          onClick={() => { setRole("doctor"); formik.resetForm(); }}
        />
      </div>

      <div className="mt-4 w-full h-[0.5px] bg-gradient-to-r from-[#D2DBD200] via-[#D2DBD2FF] to-[#D2DBD200]" />

      <h2 className="text-[12px] font-bold text-[#2C3E2F] uppercase mt-3">
        {role === "patient" ? "Patient" : "Doctor"} Information
      </h2>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 w-full">

        {/* Row 1 — Full Name full width */}
        <div className="col-span-1 sm:col-span-2">
          <InputField icon={User} name="displayName" placeholder="e.g. Sarah Johnson" formik={formik} />
        </div>

        {/* Row 2 — Email + Phone always side by side */}
        <InputField icon={Mail} name="email" type="email" placeholder="sarah@example.com" formik={formik} />
        <InputField icon={Phone} name="phone" placeholder="+1 (555) 000-0000" formik={formik} />

        {/* Row 3 — Experience (doctor) or Doctor search (patient) full width */}
        {role === "doctor" && (
          <div className="col-span-1 sm:col-span-2">
            <InputField icon={Stethoscope} name="experience" type="number" placeholder="Years of Experience" formik={formik} />
          </div>
        )}

        {role === "patient" && (
          <DoctorSearchSelect
            doctors={doctors}
            value={formik.values.doctor}
            onChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched("doctor", true)}
            error={formik.errors.doctor}
            touched={formik.touched.doctor}
          />
        )}

        {success && (
          <p className="col-span-1 sm:col-span-2 text-green-600 text-xs text-center">{success}</p>
        )}
        {apiError && (
          <p className="col-span-1 sm:col-span-2 text-red-700/60 text-xs text-center">*{apiError}</p>
        )}

        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
          <button
            type="submit"
            className="flex-1 sm:flex-[2] bg-DarkGreen text-white py-2 rounded-xl text-sm font-semibold hover:bg-DarkGreen/90 transition"
          >
            Create {role === "patient" ? "Patient" : "Doctor"} Account
          </button>
          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="flex-1 bg-white text-DarkGray border border-DarkGreen py-2 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
