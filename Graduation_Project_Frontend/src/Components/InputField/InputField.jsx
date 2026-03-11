
export default function InputField({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  formik,
  colSpan = "col-span-1"
}) {
  return (
    <div className={colSpan}>
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
      </div>

      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-700/60 text-xs mt-1">
          *{formik.errors[name]}
        </p>
      )}
    </div>
  );
}