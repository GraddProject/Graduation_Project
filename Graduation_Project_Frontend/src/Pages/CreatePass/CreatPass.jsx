import { useFormik } from "formik";
import { Leaf, ShieldCheck, Mail, Lock, Eye, EyeOff, CircleAlert, CircleCheck, ArrowRight } from "lucide-react";
import { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { object, string, ref, boolean } from "yup";
import PassRequirement from "../../Components/PassRequirment/PassRequirment";

export default function CreatPass() {
  const [email] = useState("mahaebrahiim4@example.com");
  const [role] = useState("Patient");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  

  const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const validationSchema = object({
    password: string()
      .required("Password is required")
      .matches(
      passRegex,
      "Password is invalid, please check the Security PassRequirements"
    ),
    rePassword: string()
      .required("Confirm your password")
      .oneOf([ref("password")], "Passwords must match"),
      agree: boolean()
      .oneOf([true], "You must accept the terms and conditions"),
    });


  const formik = useFormik({
    initialValues: {
      password: "",
      rePassword: "",
      agree: false,
    },
    validationSchema,
    
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      navigate("/login");
    },
  });

  const password = formik.values.password;
  const rePassword = formik.values.rePassword;
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[#?!@$%^&*-]/.test(password);
  const passwordsMatch = password && rePassword && password === rePassword;

  return (
    <div className="min-h-screen w-full flex flex-col py-10 items-center bg-gradient-to-br from-primary-50 to-primary-300 px-4 sm:px-6 lg:px-20">
      
      {/* Header */}
      <div className="flex items-center space-x-2 ">
        <div className="w-8 h-8 bg-DarkGreen rounded-full flex items-center justify-center">
          <Leaf size={20} className="text-white" />
        </div>
        <h1 className="text-[22px] md:text-[24px] lg:text-[26px] font-extrabold text-DarkGreen">
          HerJourney
        </h1>
      </div>

      {/* White Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_6px_24px_rgba(102,126,104,0.12)] p-8 py-4 flex flex-col items-center mt-4">
        
        {/* Shield Icon */}
        <div className="w-12 h-12 bg-grayBorder rounded-full flex items-center justify-center mb-3">
          <ShieldCheck size={28} className="text-DarkGreen" />
        </div>

        {/* Title & Description */}
        <h2 className="text-[26px] md:text-[22px] font-bold text-DarkGreen text-center mb-2">
          Welcome to HerJourney!
        </h2>
        <p className="text-textColor text-center text-[14px] font-medium max-w-[90%] sm:max-w-[320px] mb-4">
          Create a secure password to activate your clinical care account
        </p>

        {/* Verified Email */}
        <div className="w-full flex items-center bg-[#F7F8F7] border border-grayBorder rounded-lg px-3 py-2 mb-4">
          <div className="w-10 h-10 bg-white rounded-full shadow-[0_2px_8px_rgba(102,126,104,0.08)] flex items-center justify-center">
            <Mail size={20} className="text-DarkGreen" />
          </div>
          <div className="mx-2 flex-1 flex flex-col justify-center">
            <span className="text-[8px] text-[#9EAEA0] font-semibold uppercase">Verified Email</span>
            <span className="text-[12px] text-textColor font-semibold">{email}</span>
          </div>
          <div className="h-5 px-3 bg-[rgba(102,126,104,0.1)] flex items-center justify-center rounded-3xl">
            <span className="text-[11px] text-DarkGreen font-bold">{role}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-2">
          <span className="text-[13px] text-DarkGreen font-semibold font-sans">Create Password</span>

          {/* Password */}
          <div className="flex items-center border border-primary-900 rounded-xl px-3 py-3 focus-within:border-DarkGreen transition">
            <Lock size={16} className="text-DarkGray" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Min. 8 characters"
              className="flex-1 mx-3 outline-none text-[11px]"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} className="text-DarkGray" /> : <Eye size={16} 
              className="text-DarkGray" />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-700/60 text-xs">*{formik.errors.password}</p>
          )}

          {/* Confirm Password */}
          <span className="text-[13px] text-DarkGreen font-semibold font-sans mt-1">Repeat your password</span>
          <div className="flex items-center border border-primary-900 rounded-xl px-3 py-3 focus-within:border-DarkGreen transition">
            <ShieldCheck size={16} className="text-DarkGray" />
            <input
              type="password"
              name="rePassword"
              placeholder="Confirm password"
              className="flex-1 mx-3 outline-none text-[11px]"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {passwordsMatch && <CircleCheck size={16} className="text-green-600" />}
          </div>
          {formik.touched.rePassword && formik.errors.rePassword && (
            <p className="text-red-700/60 text-xs">*{formik.errors.rePassword}</p>
          )}

          {/* PassRequirements */}
          <div className="w-full flex flex-col gap-3 bg-[#F7F8F7] border border-grayBorder rounded-lg p-3 px-4 mt-4">
            <div className="flex flex-row gap-2 pt-1 items-center">
              <CircleAlert size={16} className="text-DarkGray" />
              <h2 className="text-DarkGray text-[11px] font-semibold uppercase">Security PassRequirements</h2>
            </div>
            <div className="alerts grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
              <PassRequirement valid={hasMinLength} text="At least 8 characters long" />
              <PassRequirement valid={hasUppercase} text="One uppercase letter (A-Z)" />
              <PassRequirement valid={hasLowercase} text="One lowercase letter (a-z)" />
              <PassRequirement valid={hasNumber} text="At least one number (0-9)" />
              <PassRequirement valid={hasSpecial} text="One special character (!@#$%)" />
              <PassRequirement valid={passwordsMatch} text="Passwords match" />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex ite gap-2 mt-2">
            <input
              type="checkbox"
              name="agree"
              checked={formik.values.agree}
              onChange={formik.handleChange}
              className="w-4 h-4 mt-1 accent-Darbg-DarkGreen cursor-pointer"
            />
            <label className="text-[12px] text-DarkGray ">I agree to the <span className="font-bold">Terms of Service</span> and <span className="font-bold">Privacy Policy</span> regarding my medical data.</label>
          </div>
          {formik.touched.agree && formik.errors.agree && (
            <p className="text-red-700/60 text-xs">*{formik.errors.agree}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!formik.isValid}
            className={`w-full  text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm ${
              formik.isValid ? "bg-DarkGreen hover:bg-DarkGreen/90 text-white" : "bg-[#F7F8F7FF] text-DarkGray cursor-not-allowed"
            }`}
          >
            Activate Account <ArrowRight size={16} className="mt-1" /> 
          </button>
        </form>
          {/* Cancle Registration  */}
        <button
            type="submit"
            disabled={!formik.isValid}
            className="w-full py-2 mt-2 rounded-xl font-semibold  items-center  text-[11px]  text-DarkGray"
          >
            Cancle Registration
          </button>

        
      </div>
    </div>
  );
}