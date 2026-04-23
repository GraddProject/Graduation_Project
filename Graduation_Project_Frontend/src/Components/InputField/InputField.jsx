export default function InputField({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  formik,
  colSpan = "col-span-1",
  label,
  endIcon,
  forgotPassword = false,  
}) {
  return (
    <div className={colSpan}>

      {/* Label row */}
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label className="text-sm font-semibold text-MainTextColor">
            {label}
          </label>
        )}
        {forgotPassword && (
          <a href="#" className="text-xs text-DarkGreen hover:underline font-medium">
            Forgot Password?
          </a>
        )}
      </div>

      <div className="flex items-center border border-primary-900 rounded-xl px-3 py-3 focus-within:border-DarkGreen transition">
        <Icon size={16} className="text-DarkGray" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="flex-1 mx-3 outline-none text-[11px]"
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {endIcon && <span>{endIcon}</span>}
      </div>

      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-700/60 text-xs mt-1">
          *{formik.errors[name]}
        </p>
      )}
    </div>
  );
}