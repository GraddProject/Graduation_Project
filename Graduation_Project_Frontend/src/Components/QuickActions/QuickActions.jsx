import React, { useState } from 'react';
import { CalendarPlus, Upload, ChartColumn } from "lucide-react";
import BookAppointmentModal from "../BookAppointmentModal/BookAppointmentModal";
import { useNavigate } from "react-router-dom";

export default function QuickActions({ doctor }) {
  const [showBookModal, setShowBookModal] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Book a Visit',
      sub: `Schedule with ${doctor?.displayName ?? 'Dr. Elena'}`,
      bgColor: 'bg-[#e8f0eb]/80',
      icon: <CalendarPlus className="w-5 h-5 text-[#5e866a]/80" />,
      onClick: () => setShowBookModal(true),
    },
    {
      label: 'Upload Tests',
      sub: 'Bloodwork, Scans, etc.',
      bgColor: 'bg-[#fce8e4]/50',
      icon: <Upload className="w-5 h-5 text-[#f28172]/80" />,
      onClick: () => navigate("/patient/upload-tests"),
    },
    {
      label: 'View Reports',
      sub: 'AI Health Insights',
      bgColor: 'bg-[#ebe8f5]/50',
      icon: <ChartColumn className="w-5 h-5 text-[#6b46c1]/80" />,
      onClick: () => navigate("/patient/medical-records"),
    },
  ];

  const ActionItem = ({ label, sub, bgColor, icon, onClick, last }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left
        ${!last ? "border-b border-gray-100" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
        </div>
      </div>
      <svg className="w-4 h-4 text-gray-300 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  return (
    <>
  
      <div className="lg:hidden bg-white rounded-2xl shadow-sm overflow-hidden">
        {actions.map((action, i) => (
          <ActionItem key={action.label} {...action} last={i === actions.length - 1} />
        ))}
      </div>

   
      <div className="hidden lg:grid grid-cols-3 gap-4">
        {actions.map(({ label, sub, bgColor, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between hover:shadow-sm shadow-sm transition-shadow text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-300 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        doctor={doctor}
        onBooked={() => setShowBookModal(false)}
      />
    </>
  );
}