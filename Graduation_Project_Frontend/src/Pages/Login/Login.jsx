import React, { useState, useContext } from "react";
import img from "../../assets/loginImg.png";
import { useFormik } from "formik";
import { object, string } from "yup";
import InputField from "../../Components/InputField/InputField";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Components/context/User.context";
import { getDoctorProfile } from "../../helpers/userProfile";
import { getPatientProfile } from "../../helpers/userProfile";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [incorrectError, setIncorrectError] = useState("");
  const { setToken, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const passRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchema = object({
    email: string().required("Email is required").email("Email is invalid"),
    password: string()
      .required("Password is required")
      .matches(
        passRegex,
        "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  });

  async function getCurrentUser(token) {
    const options = {
      url: "https://her-journey-669913381811.us-central1.run.app/api/Account/currentUser",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };
    let { data } = await axios.request(options);
    console.log("Current user data:", data);
    return data;
  }
  async function sendDataTologin(values) {
    try {
      const options = {
        url: "https://her-journey-669913381811.us-central1.run.app/api/Account/Login",
        method: "POST",
        data: values,
      };
      let { data } = await axios.request(options);
      if (data.token) {
        localStorage.setItem("token", data.token);
        const role = data.role[0];

        let profile = null;

        if (role === "Doctor") {
          profile = await getDoctorProfile(data.token);
        } else if (role === "Patient") {
            profile = await getPatientProfile(data.token);
        }
    
        const userData = {
          token: data.token,
          email: data.email,
          displayName: data.displayName,
          role: data.role[0], 
          profileImageUrl: profile.profileImageUrl,
        };

        setToken(data.token);
        setUser(userData);

        if (userData.role === "Doctor") {
          navigate("/doctor/dashboard", { replace: true });
        } else if (userData.role === "Patient") {
          navigate("/patient/dashboard", { replace: true });
        } else if (userData.role === "Admin") {
          navigate("/admindashboard", { replace: true });
        }
      }
    } catch (error) {
      setIncorrectError(
        error.response?.data?.message || "Invalid email or password",
      );
    }
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: sendDataTologin,
  });

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-1 flex-col bg-primary-100/40 justify-between p-9 ps-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 bg-DarkGreen rounded-lg text-white flex items-center justify-center">
              <Leaf size={20} />
            </div>
            <h2 className="text-DarkGreen text-xl">HerJourney</h2>
          </div>
          <p className="text-textColor text-sm font-light ml-11">
            Empowering your motherhood journey with expert-led clinical care
            management.
          </p>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[430px] aspect-[5/6] flex items-center justify-center overflow-hidden">
            <img
              src={img}
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="flex gap-1.5 mb-2">
            <div className="w-5 h-1.5 rounded-full bg-[#5a8a5a]/25" />
            <div className="w-5 h-1.5 rounded-full bg-[#5a8a5a]/25" />
            <div className="w-5 h-1.5 rounded-full bg-[#5a8a5a]" />
          </div>
          <p className="text-DarkGreen text-sm italic">
            Track your health. Manage your care. Stay confident
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-4 py-10 md:px-8">
        <div className="bg-white rounded-2xl w-full max-w-[450px] shadow-xl border md:border-gray-100 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-MainTextColor">
            Welcome Back
          </h1>
          <p className="text-sm font-light mb-8 mt-3 text-center text-textColor">
            Please sign in to your clinical account
          </p>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <InputField
              label="Email Address"
              icon={Mail}
              name="email"
              type="email"
              placeholder="name@example.com"
              formik={formik}
            />

            <InputField
              label="Password"
              icon={Lock}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              formik={formik}
              forgotPassword
              endIcon={
                showPassword ? (
                  <EyeOff
                    size={16}
                    className="text-DarkGray cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    size={16}
                    className="text-DarkGray cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />

            {incorrectError && (
              <p className="text-red-700/60 text-xs ps-2">*{incorrectError}</p>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 rounded border-primary-100 accent-DarkGreen cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs text-textColor cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-DarkGreen hover:bg-DarkGreen/90 text-white text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Sign In to Account
              <ArrowRight size={19} />
            </button>
          </form>

          <p className="text-center text-xs text-textColor mt-6">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-DarkGreen font-semibold hover:underline"
            >
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
