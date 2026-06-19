import React from 'react'
import { Search, ChevronDown, ArrowUpDown, Grid2x2, List   } from "lucide-react";
import { useState } from 'react';

export default function DoctorDashboardFilter({
  search,
  setSearch,
  sort,
  setSort,
  view,
  setView,
  setPage,
}) {
  return (
    <div className="flex flex-row justify-between items-center bg-white rounded-xl shadow mt-5 px-3 py-2 gap-4">

      <div className="flex w-full md:basis-1/3  items-center bg-[#FAFAF9] border rounded-[12px] px-2 py-2">
        <Search size={18} className="mr-2 text-[#4A6B4EFF]" />
        <input
          type="text"
          placeholder="Search patients by name"
          className="flex-1 outline-none bg-transparent placeholder:text-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="hidden sm:flex flex-1 items-center justify-between gap-4">

        <div className="relative flex-1 w-full">
          <button
            onClick={() => {
              setSort("RiskLevel");
              setPage(1);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-[#4A6B4EFF] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px]"
          >
            <ArrowUpDown size={18} />
            Risk Level
          </button>
        </div>

        <div className="relative flex-1 w-full">
          <button
            onClick={() => {
              setSort("Trimester");
              setPage(1);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-[#4A6B4EFF] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px]"
          >
            <ArrowUpDown size={18} />
            Pregnancy Stage
          </button>
        </div>
      
        <div className="relative flex-1 w-full">

        <button
          onClick={() => {
            setSort("NextAppointmentAsc");
            setPage(1);
          }}
          className="flex w-full items-center gap-2 px-4 py-2 text-[#4A6B4EFF] bg-[#FAFAF9] border border-[#E8F5E9] rounded-[12px]"
        >
          <ArrowUpDown size={18} />
          Next Appointment
        </button>
        </div>

        <div className="flex gap-1 md:hidden lg:flex items-center rounded-[12px] px-2 py-1">
          <div
            onClick={() => setView("grid")}
            className={`cursor-pointer flex items-center justify-center p-1 rounded-[10px] transition-all ${
              view === "grid" ? "bg-white text-[#171A1F]" : "text-[#566454]"
            }`}
          >
            <Grid2x2 size={22} />
          </div>

          <div
            onClick={() => setView("list")}
            className={`cursor-pointer flex items-center justify-center p-1 rounded-[10px] transition-all ${
              view === "list" ? "bg-white text-[#171A1F]" : "text-[#566454]"
            }`}
          >
            <List size={22} />
          </div>
        </div>

      </div>
    </div>
  );
}

