import React from 'react';
import img from "../../assets/download.png";
import { Clock, CalendarCheck } from "lucide-react";

export default function PatientDataCard({ view = "grid" }) {
  return (
    <div
      className={`
        ${
          view === "grid"
            ? "flex flex-col  p-3 gap-2"
            : "flex flex-row items-center justify-between w-full px-3 py-2 gap-3"
        }
        bg-white rounded-xl shadow-[0px_0px_2px_#171a1f1F,_0px_2px_5px_#171a1f17] mt-4
      `}
    >
      <div className="flex gap-3">
        <img
          src={img}
          alt="User Avatar"
          className={`${
            view === "grid" ? "w-14 h-14" : "w-10 h-10"
          } rounded-full`}
        />
        <span className="font-bold text-[#2C3E2F] text-[17px] mt-2">
          Maha Ebrahim
        </span>
      </div>

      <div
        className={`
          flex gap-2
          ${view === "grid" ? "flex-row mt-2 mb-2" : "flex-row"}
        `}
      >
        <div className="bg-[#F0F4F0] py-1 px-2 text-sm text-center rounded-2xl text-[#566454] font-medium">
          Week 14
        </div>
        <div className="bg-[#F0F4F0] py-1 px-3 text-sm rounded-2xl text-[#566454] font-medium">
          2nd Trimester
        </div>
        <div className="bg-[#E64D4D1A] py-1 px-3 text-sm rounded-2xl text-red-600/80 font-medium">
          High Risk 
        </div>
      </div>

      {/* APPOINTMENTS */}
      <div
        className={`
          ${
            view === "grid"
              ? "border-y py-3 flex flex-col gap-3"
              : "flex gap-10 border-none"
          }
          border-[#F1F4F1]
        `}
      >
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Clock size={15} />
            <span className="text-[#566454] text-sm">
              Last Appointment:
            </span>
          </div>
          <span className="text-[#151915] text-sm font-semibold">
            Oct20, 2024
          </span>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck size={15} />
            <span className="text-[#566454] text-sm">
              Next Appointment:
            </span>
          </div>
          <span className="text-[#151915] text-sm font-semibold">
            Oct27, 2024
          </span>
        </div>
      </div>

      <button
        className={`
          ${view === "grid" ? "w-full mt-2" : "w-fit"}
          bg-[#FAFAF9] text-[#4A5F4E] py-2 px-4 rounded-xl font-medium border border-[#4A5F4E33]
        `}
      >
        View Profile
      </button>
    </div>
  );
}