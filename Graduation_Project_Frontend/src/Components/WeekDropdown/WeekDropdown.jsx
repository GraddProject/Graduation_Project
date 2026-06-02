import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const DATE_OPTIONS = [
  { value: "All", label: "All dates" },
  { value: "CurrentWeek", label: "This week" },
  { value: "NextWeek", label: "Next week" },
];

export function WeekDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = DATE_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="ml-auto relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-semibold transition-colors bg-gray-100 border-transparent text-gray-500 hover:text-gray-700`}
      >
        {selected.label}
        <ChevronDown
          size={11}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 left-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
          style={{ minWidth: "120px" }}
        >
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[11px] font-semibold transition-colors
                ${
                  value === opt.value
                    ? "bg-[#eef4ee] text-[#2d4a2d]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
