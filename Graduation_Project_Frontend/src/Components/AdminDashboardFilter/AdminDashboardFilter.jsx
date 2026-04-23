import { useState, useRef } from "react";
import { Search, ChevronDown, ArrowUpDown, Calendar, RotateCcw } from "lucide-react";

export default function AdminDashboardFilter({
  search,
  setSearch,
  role,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  sort,
  setSort,
  setPage,
  handleReset,
}) {
  const [openRole, setOpenRole] = useState(false);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const roleOptions = [
    { label: "All Roles", value: "all" },
    { label: "Doctors", value: "doctors" },
    { label: "Patients", value: "patients" },
  ];

  const selectedRole = roleOptions.find((r) => r.value === role);

  return (
    <div>
      <div className="bg-white w-full flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2 p-4 sm:p-3 rounded-lg shadow-[0px_2px_4px_#00000012]">

        <div className="flex flex-[2] w-full sm:flex-[2] min-w-0 items-center bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] px-4 py-3 sm:px-3 sm:py-2 text-[14px] sm:text-[12px] md:text-[14px]">
          <Search size={18} className="text-[#A8B9AA] mr-2 sm:w-[14px] sm:h-[14px]" />
          <input
            type="text"
            placeholder="Search by name"
            className="flex-1 outline-none bg-[#FAFAF9] placeholder:text-[#7A8F7C]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="relative flex-1 w-full sm:flex-[1] min-w-0">
          <div
            onClick={() => setOpenRole(!openRole)}
            className="flex items-center justify-between px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
          >
            <span>Role: {selectedRole?.label}</span>
            <ChevronDown size={18} className={`transition ${openRole ? "rotate-180" : ""} sm:w-[14px] sm:h-[14px]`} />
          </div>

          {openRole && (
            <div className="absolute left-0 mt-1 w-full bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] shadow-sm overflow-hidden z-20">
              {roleOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setRole(option.value);
                    setOpenRole(false);
                    setPage(1);
                  }}
                  className="px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] hover:bg-[#F3F4F2] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
                >
                  Role: {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          onClick={() => fromDateRef.current?.showPicker()}
          className="flex flex-1 w-full sm:flex-[1] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer relative text-[14px] sm:text-[12px] md:text-[14px]"
        >
          <Calendar size={18} className="sm:w-[14px] sm:h-[14px]" />
          <span>From:</span>
          <input
            ref={fromDateRef}
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="text-[#A8B9AA]">{fromDate || "YYYY-MM-DD"}</span>
        </div>

        <div
          onClick={() => toDateRef.current?.showPicker()}
          className="flex flex-1 w-full sm:flex-[1] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer relative text-[14px] sm:text-[12px] md:text-[14px]"
        >
          <Calendar size={18} className="sm:w-[14px] sm:h-[14px]" />
          <span>To:</span>
          <input
            ref={toDateRef}
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="text-[#A8B9AA]">{toDate || "YYYY-MM-DD"}</span>
        </div>

        <button
          onClick={() => {
            setSort(sort === "DateDesc" ? "DateAsc" : "DateDesc");
            setPage(1);
          }}
          className="flex flex-1 w-full sm:flex-[1] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] text-[14px] sm:text-[12px] md:text-[14px]"
        >
          <ArrowUpDown size={18} className="sm:w-[14px] sm:h-[14px]" />
          Sort: {sort === "DateDesc" ? "Newest First" : "Oldest First"}
        </button>

        <button
          onClick={handleReset}
          className="flex flex-[0.7] w-full sm:flex-[0.7] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-white bg-DarkGreen border border-[#E8F5E9] rounded-[12px] justify-center text-[14px]  md:text-[16px]"
        >
          <RotateCcw size={18} className="sm:w-[14px] sm:h-[14px]" />
          Reset
        </button>

      </div>
    </div>
  );
}