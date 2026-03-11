import { useState } from "react";
import RoleCard from "../RoleCard/RoleCard";
import InputField from "../InputField/InputField";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import { User, Mail, Phone, Calendar, Droplet, Baby, Search, Stethoscope } from "lucide-react";

export default function RegisterForm() {
  const [role, setRole] = useState("patient");

  const validationSchema = object({
    displayName: string().required("Display name is required"),
    email: string().email("Invalid email").required("Email is required"),
    phone: string().required("Phone is required"),
    experience: role === "doctor" ? number().required("Years of experience required") : number(),
    bloodType: role === "patient" ? string().required("Blood type is required") : string(),
    birthDate: role === "patient" ? string().required("Birth date required") : string(),
    pregnancyWeek: role === "patient" ? number().required("Pregnancy week required") : number(),
  });

  const formik = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      phone: "",
      experience: "",
      bloodType: "",
      birthDate: "",
      pregnancyWeek: "",
      doctor: ""
    },
    validationSchema,
    onSubmit: (values) => console.log(values)
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
          onClick={() => setRole("patient")}
        />
        <RoleCard
          title="Doctor"
          description="Medical practitioner"
          icon={Stethoscope}
          active={role === "doctor"}
          onClick={() => setRole("doctor")}
        />
      </div>

      <div className="mt-4 w-full h-[0.5px] bg-gradient-to-r from-[#D2DBD200] via-[#D2DBD2FF] to-[#D2DBD200]" />

      <h2 className="text-[12px] font-bold text-[#2C3E2F] uppercase mt-3">
        {role === "patient" ? "Patient" : "Doctor"} Information
      </h2>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 w-full"
      >

        <InputField
          icon={User}
          name="displayName"
          placeholder="e.g. Sarah Johnson"
          formik={formik}
        />

        <InputField
          icon={Mail}
          name="email"
          type="email"
          placeholder="sarah@example.com"
          formik={formik}
        />

        <InputField
          icon={Phone}
          name="phone"
          placeholder="+1 (555) 000-0000"
          formik={formik}
        />

        {role === "doctor" && (
          <InputField
            icon={Stethoscope}
            name="experience"
            type="number"
            placeholder="Years of Experience"
            formik={formik}
          />
        )}

        {role === "patient" && (
          <>
            <InputField
              icon={Droplet}
              name="bloodType"
              placeholder="Blood Type"
              formik={formik}
            />
            <InputField
              icon={Calendar}
              name="birthDate"
              type="date"
              formik={formik}
            />
            <InputField
              icon={Baby}
              name="pregnancyWeek"
              type="number"
              placeholder="Pregnancy Week"
              formik={formik}
            />
            <InputField
              icon={Search}
              name="doctor"
              placeholder="Search doctors..."
              formik={formik}
              colSpan="sm:col-span-2"
            />
          </>
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
            className="flex-1 bg-white text-DarkGray border border-DarkGreen py-2 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
        </div>

      </form>

    </div>
  );
}