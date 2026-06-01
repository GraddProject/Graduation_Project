import React from 'react'
import { Search, ChevronDown, ArrowUpDown, Grid2x2, List   } from "lucide-react";
import { useState } from 'react';

export default function DoctorDashboardFilter({search , setSearch , risk , setRisk , sort , setSort , pregnancyStage , setPregnancyStage , view , setView , setPage}) {


  return<>
        <div className='flex flex-row justify-between items-center bg-white rounded-xl shadow mt-5 px-3 py-2 gap-4'>

        <div className="flex  basis-1/3 items-center bg-[#FAFAF9] border rounded-[12px] px-4 py-2">
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
          {/* <div
            onClick={() => setOpenRisk(!openRisk)}
            className="flex items-center justify-between px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
          >
            <span>{selectedRisk?.label}</span>
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
                  {option.label}
                </div>
              ))}
            </div>
          )} */}
          <button
            onClick={() => {
            setSort("RiskLevel")
            setPage(1);
          }}
          className="flex flex-1 w-full sm:flex-[1] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] text-[14px] sm:text-[12px] md:text-[14px]"
        >
          <ArrowUpDown size={18} className="sm:w-[14px] sm:h-[14px]" />
          Risk Level
        </button>
        </div>
        
        <div className="relative flex-1 w-full sm:flex-[1] min-w-0">
          {/* <div
            onClick={() => setOpenPregnancyStage(!openPregnancyStage)}
            className="flex items-center justify-between px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] cursor-pointer text-[14px] sm:text-[12px] md:text-[14px]"
          >
            <span> {selectedPregnancyStage?.label}</span>
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
                   {option.label}
                </div>
              ))}
            </div>
          )} */}

          <button
          onClick={() => {
            setSort("Trimester")
            setPage(1);
          }}
          className="flex flex-1 w-full sm:flex-[1] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] text-[14px] sm:text-[12px] md:text-[14px]"
        >
          <ArrowUpDown size={18} className="sm:w-[14px] sm:h-[14px]" />
          Pregnancy Stage 
        </button>
          </div>    
        
       <button
          onClick={() => {
            setSort(
            sort === "NextAppointmentAsc"
            ? "Oldest"
            : "NextAppointmentAsc"
           );
            setPage(1);
          }}
          className="flex flex-1 w-full sm:flex-[1] min-w-0 items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 text-[#7A8F7C] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px] text-[14px] sm:text-[12px] md:text-[14px]"
        >
          <ArrowUpDown size={18} className="sm:w-[14px] sm:h-[14px]" />
           {sort === "NextAppointmentAsc" ? "NextAppointmentAsc" : "NextAppointmentDesc"}
        </button>

        <div className="flex gap-1 items-center rounded-[12px] px-2 py-1">

            <div
              onClick={() => setView("grid")}
              className={`cursor-pointer flex items-center justify-center p-1  rounded-[10px] transition-all
              ${view === "grid" ? "bg-white text-[#171A1F]" : "text-[#566454]"}`}
            >
              <Grid2x2 size={22} />
            </div>

            <div
              onClick={() => setView("list")}
              className={`cursor-pointer flex items-center justify-center p-1 rounded-[10px] transition-all
              ${view === "list" ? "bg-white text-[#171A1F]" : "text-[#566454]"}`}
            >
              <List size={22} />
            </div>

          </div>

      </div>
  
  </>
}
