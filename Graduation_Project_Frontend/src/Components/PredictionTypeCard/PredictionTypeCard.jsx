import React from "react";
import { Check } from "lucide-react";

export default function PredictionTypeCard({ title, desc, icon: Icon, iconBg, iconColor, value, selected, onClick,}) {
  return (
    <button
      onClick={onClick}
      className={`relative  border p-4 w-full md:w-2/4 lg:w-2/4 flex gap-4 items-center rounded-xl transition
      ${selected ? "bg-[#F4FBF4FF] border-[#4A6B4EFF] border-2" : "border-[#E8EBE8FF]"}`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-transparent border-[#4A6B4EFF] border-2 rounded-full flex items-center justify-center">
          <Check size={10} className="text-[#4A6B4EFF] " />
        </div>
      )}

      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}
      >
        <Icon size={28} className={iconColor} />
      </div>

      <div className="flex flex-col ">
        <h2 className="text-[#1A2E1CFF] text-start">{title}</h2>
        <p className="text-[#6B7E6DFF] text-sm hidden lg:flex">{desc}</p>
      </div>
    </button>
  );
}