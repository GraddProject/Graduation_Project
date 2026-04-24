import React, { useState, useEffect } from 'react'
import StatisticsCard from '../../Components/StatisticsCard/StatisticsCard'
import { UsersRound, Calendar, MessageSquare , TriangleAlert , Search , Grid2x2 , List , ChevronDown } from "lucide-react";
import PatientDataCard from '../../Components/PatientDataCard/PatientDataCard';
import Pagination from '../../Components/Pagination/Pagination';
import DoctorDashboardCharts from '../../Components/DoctorDashboardCharts/DoctorDashboardCharts';

export default function DoctorDashboard() {
  const [view, setView] = useState("grid");
  const [openRisk, setOpenRisk] = useState(false);
  const [openPregnancyStage, setOpenPregnancyStage] = useState(false);
  const [risk, setRisk] = useState("all");
  const [pregnancyStage, setPregnancyStage] = useState("all");
  const [search, setSearch] = useState("");

  const [patients, setPatients] = useState(
    Array.from({ length: 4 }, (_, i) => i + 1)
  );

  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    setTotalItems(patients.length);
  }, [patients]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPatients = patients.slice(startIndex, endIndex);

  const riskOptions = [
    { label: "All Cases", value: "all" },
    { label: "High Risk", value: "high" },
    { label: "Medium Risk", value: "medium" },
    { label: "Low Risk", value: "low" },
  ];

  const pregnancyStages = [
    { label: "All Stages", value: "all" },
    { label: "First Trimester", value: "1" },
    { label: "Second Trimester", value: "2" },
    { label: "Third Trimester", value: "3" },
  ];


  const selectedRisk = riskOptions.find((r) => r.value === risk);
  const selectedPregnancyStage = pregnancyStages.find((s) => s.value === pregnancyStage);

  const handleReset = () => {
    setSearch("");
    setRisk("all");
    setPregnancyStage("all");
    setPage(1);
  };

  return (
    <div className='bg-[#F7F9F7FF] w-full min-h-screen px-8 py-8'>

      <div className="flex items-center gap-3">
        <StatisticsCard icon={UsersRound} title="Total Patients" value="1,245" iconColor={'#667E68FF'} circleColor={'#F5FAF5FF'} />
        <StatisticsCard icon={Calendar} title="Appointments Today" value="20" iconColor={'#2196F3FF'} circleColor={'#E3F2FDFF'} />
        <StatisticsCard icon={MessageSquare} title="Pending Reviews" value="5" iconColor={'#F97316FF'} circleColor={'#FFFBEBFF'} />
        <StatisticsCard icon={TriangleAlert} title="High Risk Cases" value="3" iconColor={'#CA001EFF'} circleColor={'#F3E5F5FF'} />
      </div>

      <div className='flex flex-row justify-between items-center bg-white rounded-xl shadow mt-8 p-3 gap-4'>

        <div className="flex basis-1/3 items-center bg-[#FAFAF9] border rounded-[12px] px-4 py-2">
          <Search size={18} className="mr-2" />
          <input
            type="text"
            placeholder="Search patients by name"
            className="flex-1 outline-none bg-transparent"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="relative flex-1 w-full sm:flex-[1] min-w-0">
          <div
            onClick={() => setOpenRisk(!openRisk)}
            className="flex items-center justify-between px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
          >
            <span>Risk: {selectedRisk?.label}</span>
            <ChevronDown size={18} className={`transition ${openRisk ? "rotate-180" : ""} sm:w-[14px] sm:h-[14px]`} />
          </div>

          {openRisk && (
            <div className="absolute left-0 mt-1 w-full bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] shadow-sm overflow-hidden z-20">
              {riskOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setRisk(option.value);
                    setOpenRisk(false);
                    setPage(1);
                  }}
                  className="px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] hover:bg-[#F3F4F2] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
                >
                  Risk: {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative flex-1 w-full sm:flex-[1] min-w-0">
          <div
            onClick={() => setOpenPregnancyStage(!openPregnancyStage)}
            className="flex items-center justify-between px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
          >
            <span>Pregnancy Stage: {selectedPregnancyStage?.label}</span>
            <ChevronDown size={18} className={`transition ${openPregnancyStage ? "rotate-180" : ""} sm:w-[14px] sm:h-[14px]`} />
          </div>

          {openPregnancyStage && (
            <div className="absolute left-0 mt-1 w-full bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] shadow-sm overflow-hidden z-20">
              {pregnancyStages.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setPregnancyStage(option.value);
                    setOpenPregnancyStage(false);
                    setPage(1);
                  }}
                  className="px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] hover:bg-[#F3F4F2] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
                >
                  Pregnancy Stage: {option.label}
                </div>
              ))}
            </div>
          )}
          </div>

        <div className="flex gap-2 items-center bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] px-2 py-1">

            <div
              onClick={() => setView("grid")}
              className={`cursor-pointer flex items-center justify-center p-2  rounded-[10px] transition-all
              ${view === "grid" ? "bg-white text-[#171A1F]" : "text-[#566454]"}`}
            >
              <Grid2x2 size={22} />
            </div>

            <div
              onClick={() => setView("list")}
              className={`cursor-pointer flex items-center justify-center p-2 rounded-[10px] transition-all
              ${view === "list" ? "bg-white text-[#171A1F]" : "text-[#566454]"}`}
            >
              <List size={22} />
            </div>

          </div>

      </div>

      <div className="mt-5">
        <div className={view === "grid" ? "grid grid-cols-4 w-full gap-4  border-b pb-6" : "flex flex-col"}>
          {currentPatients.map((p, index) => (
            <PatientDataCard key={index} view={view} />
          ))}
        </div>
      </div>

      <div className='border-b'>
      {totalItems > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={setPage}
        />
      )}
      </div>


      <DoctorDashboardCharts />

    </div>
  );
}