import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DropdownFilter({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <>

        <div className="relative flex-1 w-full sm:flex-[1] min-w-0">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
          >
            <span>{label}: {selected?.label}</span>
            <ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""} sm:w-[14px] sm:h-[14px]`} />
          </div>

          {open && (
            <div className="absolute left-0 mt-1 w-full bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] shadow-sm overflow-hidden z-20">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setPage(1);
                  }}
                  className="px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] hover:bg-[#F3F4F2] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
                >
                  {label}: {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
</>
    
  );
}