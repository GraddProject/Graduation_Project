import React, { useState } from "react";
import { Mail, Clock, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../helpers/getInitials";
import { formatDate } from "../../helpers/formatDate";
import { riskStyles } from "../../helpers/riskStyle";
import { normalizeRisk } from "../../helpers/riskStyle";

export default function PatientDataCard({ view = "grid", patient }) {
  const { id, name, email, image, pregnancyWeek, trimester, RiskLevel, lastAppointmentDate, nextAppointmentDate, } = patient;

  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/doctor/patient-profile/${id}`);
  };

  const risk = riskStyles[normalizeRisk(RiskLevel)]|| {
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    label: "Not Predicted",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-[#EEF2EE] 
      hover:shadow-md transition-all duration-200 cursor-pointer
      ${view === "grid" ? "p-4 flex flex-col gap-5" : "p-4 flex items-center justify-between gap-6"}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 min-w-[220px] ">
        {image && !imageError ? (
          <img
            src={image}
            onError={() => setImageError(true)}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#4A6B4E] text-white flex items-center justify-center font-semibold">
            {getInitials(name)}
          </div>
        )}

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-[#1F2A1F]">
            {name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-[#667566]">
            <Mail size={12} />
            {email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap w-full">
        <span className="px-3 py-1 text-sm rounded-full bg-[#F3F6F3] text-[#556655]">
          Week {pregnancyWeek}
        </span>

        <span className="px-3 py-1 text-sm rounded-full bg-[#F3F6F3] text-[#556655]">
          {trimester}
        </span>

        <span
          style={{
            color: risk.color,
            backgroundColor: risk.backgroundColor,
          }}
          className="px-3 py-1 text-sm rounded-full font-medium"
        >
          {risk.label}
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm text-[#667566] min-w-[220px] w-full">
        <div className="flex  items-center gap-2">
          <Clock size={14} />
          <div className="flex flex-row items-center justify-between w-full">
            <p>Last Appointment</p>
            <p className="text-[#1F2A1F] font-medium">
              {lastAppointmentDate
                ? formatDate(lastAppointmentDate)
                : "No record"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CalendarCheck size={14} />
          <div className="flex flex-row items-center justify-between gap-3 w-full">
            <p>Next Appointment</p>
            <p className="text-[#1F2A1F] font-medium">
              {nextAppointmentDate
                ? formatDate(nextAppointmentDate)
                : "Not scheduled"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2  w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="px-4 py-2 text-sm rounded-xl border w-6/12 border-[#DDE5DD] text-[#4A5F4E] hover:bg-[#F6F8F6]"
        >
          View Profile
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/doctor/prediction/${id}`);
          }}
          className="px-4 py-2 text-sm rounded-xl bg-[#4A6B4E] w-6/12 text-white hover:bg-[#3F5A42]"
        >
          Predict
        </button>
      </div>
    </div>
  );
}