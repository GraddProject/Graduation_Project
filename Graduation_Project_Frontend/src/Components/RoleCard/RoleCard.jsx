import { Check } from "lucide-react";

export default function RoleCard({ title, description, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full px-3 py-2 flex flex-col items-start gap-3 rounded-[12px] border transition-all duration-200
        ${active ? "bg-[#F5FAF5FF] border-DarkGreen" : "bg-white border-[#C8E6C9FF] hover:border-DarkGreen hover:bg-gray-50"}`}
    >
    
      {active && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-DarkGreen rounded-full flex items-center justify-center">
          <Check size={8} className="text-white" />
        </div>
      )}

      <div className="flex items-center gap-3 mt-1">
        <div className="w-8 h-8 bg-DarkGreen rounded-lg flex items-center justify-center">
          <Icon size={15} className="text-white" />
        </div>

        <div className="text-left ">
          <p className="text-[#2C3E2F] text-[11px] font-semibold">{title}</p>
          <p className="text-[#7A8F7C] text-[8px] font-medium">{description}</p>
        </div>
      </div>
    </button>
  );
}