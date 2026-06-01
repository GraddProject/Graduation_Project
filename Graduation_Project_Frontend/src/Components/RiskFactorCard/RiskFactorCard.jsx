import React from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react';

export default function RiskFactorCard({ label, flag }) {

  return (
    <div
      className={`flex items-center gap-2 min-w-fit flex-grow rounded-3xl py-2 px-4 ${
        flag === 0
          ? "bg-[#E8EBE8FF] text-[#929292] border border-[#E8EBE8FF]"
          : "bg-[#4A5F4EFF] text-white"
      }`}
    >
      <div className="flex gap-1  items-center">
        {flag === 0 ? (
          <CircleAlert size={15} className="text-[#929292] " />
        ) : (
          <CircleCheck size={15} className="text-white" />
        )}


      <p className="text-xs ">{label}</p>
            </div>
    </div>
  );
}