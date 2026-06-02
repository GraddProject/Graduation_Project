import React from 'react';
import { Clock, CalendarCheck, Mail } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../../helpers/getInitials';
import { formatDate } from '../../helpers/formatDate';


export default function PatientDataCard({ view = "grid" , patient }) {

  const { name, email , phone, image, pregnancyWeek, trimester, RiskLevel, lastAppointmentDate, nextAppointmentDate } = patient;

  const [imageError, setImageError] = useState(false);
  const riskStyles = {
  "Low Risk": {
    backgroundColor: "#4A6B4E1A",
    color: "#4A6B4E",
  },
  "Medium Risk": {
    backgroundColor: "#E6A14E1A",
    color: "#E6A14E",
  },
  "High Risk": {
    backgroundColor: "#E64D4D1A",
    color: "#E64D4D",
  },
};
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/doctor/patient-profile/${patient.id}`);
  };

  
  return (
    <div
      className={`
        ${
          view === "grid"
            ? "flex flex-col  px-3 py-4 gap-2"
            : "flex flex-row items-center justify-between w-full px-3 py-3 gap-3 min-w-full"
        }
        bg-white rounded-xl shadow-[0px_0px_2px_#171a1f1F,_0px_2px_5px_#171a1f17] mt-4 
      `}
    >
      <div className="flex gap-2 cursor-pointer"  onClick={handleClick} >
        {image && !imageError ? (
          <img
            src={image}
            alt="User Avatar"
            onError={() => setImageError(true)}
            className={`${ view === "grid" ? "w-12 h-12" : "w-10 h-10" } rounded-full object-cover cursor-pointer`}
            />
        ) : (
        
        <div
          className={`${
          view === "grid" ? "w-12 h-12" : "w-12 h-12"
          } rounded-full bg-[#4A6B4E] flex items-center justify-center text-white font-bold`}
       
        >
          {getInitials(name)}
        </div>
        )}
        <div className='flex flex-col  justify-center gap-1'>
          <span className="font-bold text-[#2C3E2F] text-[15px] cursor-pointer " onClick={handleClick}>
            {name}
          </span>
          <div className='flex flex-row items-center gap-1'>
            <Mail size={12} className="text-[#566454]" />
            <span className="text-[#566454] text-xs">
              {email}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`
          flex gap-2
          ${view === "grid" ? "flex-row mt-2 mb-2" : "flex-row"}
        `}
      >
        <div className="bg-[#F0F4F0] py-1 px-2 text-sm text-center rounded-2xl text-[#566454] font-medium">
          Week {pregnancyWeek}
        </div>
        <div className="bg-[#F0F4F0] py-1 px-3  text-sm rounded-2xl text-[#566454] font-medium">
          {trimester}
        </div>
        <div className="bg-[#E64D4D1A] py-1 px-3 text-sm rounded-2xl "  style={riskStyles[RiskLevel] || { backgroundColor: "#E5E7EB", color: "#374151" }}>
          {RiskLevel}
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
        <div className={` ${view === "grid" ? "flex items-center gap-2 justify-between" : "flex flex-col gap-1"}`}>
          <div className="flex items-center gap-1">
            {view === "grid" && <Clock size={14} className="text-[#566454]" />}
            <span className="text-[#566454] text-sm ">
              Last Appointment:
            </span>
          </div>
          <span className="text-[#151915] text-sm  ">
            {lastAppointmentDate ? formatDate(lastAppointmentDate) : "No previous appointments"}
          </span>
        </div>

        <div className={` ${view === "grid" ? "flex items-center gap-2 justify-between" : "flex flex-col gap-1"}`}>
          <div className="flex items-center gap-1">
            {view === "grid" &&<CalendarCheck size={14} className="text-[#566454]" />}
            <span className="text-[#566454] text-sm">
              Next Appointment:
            </span>
          </div>
          <span className="text-[#151915] text-sm ">
            {nextAppointmentDate ?  formatDate(nextAppointmentDate) : "No upcoming appointments"}
          </span>
        </div>
      </div>

      <div className='flex flex-row items-center gap-2'>
      <button
        className={`
          ${view === "grid" ? "w-full mt-1" : "w-fit"}
          bg-[#FAFAF9] text-[#4A5F4E] py-1 px-4 rounded-xl font-medium border border-[#4A5F4E33]
        `}
        onClick={handleClick}
        
      >
        View Profile
      </button>
      
      <button
        className={`
          ${view === "grid" ? "w-full mt-1" : "w-fit"}
          bg-[#4A6B4EFF] text-white py-1 px-4 rounded-xl font-medium border border-[#4A5F4E33]
        `}
        onClick={()=>{navigate(`/doctor/prediction/${patient.id}`)}}
      >
        Run Prediction
      </button>
      </div>
    </div>
  );
}