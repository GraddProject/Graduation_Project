import { Check } from "lucide-react";

export default function RoleCard({ title, description, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative  p-3 flex flex-col items-start gap-3 rounded-[12px] border transition-all duration-200
        ${active ? "bg-[#F5FAF5FF] border-DarkGreen" : "bg-white border-[#C8E6C9FF] hover:border-DarkGreen hover:bg-gray-50"}`}
    >
      {/* Check فوق على اليمين */}
      {active && (
        <div className="absolute top-1 right-2 w-3 h-3 bg-DarkGreen rounded-full flex items-center justify-center">
          <Check size={8} className="text-white" />
        </div>
      )}

      {/* محتوى الايقونة والعنوان */}
      <div className="flex items-center gap-3 mt-1">
        <div className="w-6 h-6 bg-DarkGreen rounded-lg flex items-center justify-center">
          <Icon size={15} className="text-white" />
        </div>

        <div className="text-left ">
          <p className="text-[#2C3E2F] text-[11px] font-semibold">{title}</p>
          <p className="text-[#7A8F7C] text-[6px] font-medium">{description}</p>
        </div>
      </div>
    </button>
  );
}