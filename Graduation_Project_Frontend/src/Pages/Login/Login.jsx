import React, { useState } from "react";
import img from "../../assets/loginImg.png";
import { useFormik } from "formik";
import { object, string } from "yup";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const passRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchema = object({
    email: string().required("Email is required").email("Email is invalid"),
    password: string()
      .required("Password is required")
      .matches(
        passRegex,
        "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    // onSubmit: sendDataToLogin,
  });

  return (
    <div className="min-h-screen flex">

      <div className="hidden md:flex flex-1 flex-col bg-BgColor justify-between p-9 ps-12">
      
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 bg-DarkGreen rounded-lg text-white flex items-center justify-center">
              <Leaf size={20} />
            </div>
            <h2 className="text-DarkGreen text-xl">HerJourney</h2>
          </div>
          <p className="text-textColor text-sm font-light ml-11">
            Empowering your motherhood journey with expert-led clinical care management.
          </p>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[430px] aspect-[5/6] flex items-center justify-center overflow-hidden">
            <img src={img} alt="Login Illustration" className="w-full h-full object-cover" />
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
        <div className="bg-white rounded-2xl w-full max-w-[450px] md:shadow-xl md:border md:border-gray-100 p-6 md:p-10">

          <div className="flex flex-col items-center mb-6 md:hidden">
            <div className="w-10 h-10 bg-DarkGreen rounded-xl text-white flex items-center justify-center mb-2">
              <Leaf size={22} />
            </div>
            <h2 className="text-DarkGreen text-lg font-semibold">HerJourney</h2>
            <p className="text-textColor text-xs font-light text-center mt-1 max-w-[220px]">
              Empowering your motherhood journey with expert-led clinical care management.
            </p>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-MainTextColor">
            Welcome Back
          </h1>
          <p className="text-sm font-light mb-8 mt-3 text-center text-textColor">
            Please sign in to your clinical account
          </p>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>

            <div>
              <label className="text-sm font-semibold text-MainTextColor">
                Email Address
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3.5 top-3.5 text-DarkGreen/60 pointer-events-none">
                  <Mail size={16} className="text-DarkGray" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-700 text-[11px]  placeholder-DarkGreen/60 focus:outline-none focus:ring-2 focus:ring-DarkGreen/30 focus:border-DarkGreen transition"
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-700/60 text-xs mt-2 ps-2">
                  *{formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-MainTextColor">
                  Password
                </label>
                <a href="#" className="text-xs text-DarkGreen hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-DarkGreen/60 pointer-events-none">
                  <Lock size={16} className="text-DarkGray"/>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-primary-700 text-[11px] text-textColor placeholder-DarkGreen/60 focus:outline-none focus:ring-2 focus:ring-DarkGreen/30 focus:border-DarkGreen transition"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                  className="absolute right-3.5 top-3.5 text-DarkGreen/60 hover:text-DarkGreen transition"
                >
                  {showPassword ? <EyeOff size={16} className="text-DarkGray" /> : <Eye size={16} className="text-DarkGray" />}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-700/60 text-xs mt-2 ps-2">
                  *{formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 rounded border-primary-100 accent-DarkGreen cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-textColor cursor-pointer select-none">
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
            <a href="#" className="text-DarkGreen font-semibold hover:underline">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}