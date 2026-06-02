export default function StatsCard({ icon: Icon, value, label, text, flag = false, accent = false, iconBg = "bg-blue-50", iconColor = "text-blue-500", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md hover:border-red-200 transition-all" : ""}`}
    >
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={21} className={iconColor} />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-tight ${accent ? "text-red-500" : flag ? "text-green-800/75" : "text-gray-800"}`}>
          {value}
        </p>
        <p className="text-xs font-bold text-gray-600/85 mt-0.5">{label}</p>
        <p className={`text-xs mt-0.5 ${accent ? "text-red-500" : "text-gray-400"}`}>
          {text}
        </p>
      </div>
    </div>
  );
}