import { Search } from "lucide-react";

export default function SearchInput({ value, onChange , placeholder }) {
  return (
    <>
    <div className="flex flex-[2] w-full sm:flex-[2] min-w-0 items-center bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] px-4 py-3 sm:px-3 sm:py-2 text-[14px] sm:text-[12px] md:text-[14px]">
      <Search size={18} className="text-[#A8B9AA] mr-2 sm:w-[14px] sm:h-[14px]" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}  
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent placeholder:text-[#7A8F7C]"
      />
    </div>
    </>
  );
}