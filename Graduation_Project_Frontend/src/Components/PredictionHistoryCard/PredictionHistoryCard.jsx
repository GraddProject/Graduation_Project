import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { riskStyles } from "../../helpers/riskStyle";

export default function PredictionHistoryCard({
  month,
  day,
  predictionType,
  risk,
  confidence
}) {

  const riskStyle = riskStyles[risk] || {
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
  };

  return (
    <div className="border-b px-3 py-4 flex flex-row items-center justify-between w-full">

      {/* LEFT SIDE */}
      <div className="flex flex-col gap-2 w-full">

        {/* TOP ROW (DATE + TYPE + RISK) */}
        <div className="flex flex-row items-center gap-2 mb-2 flex-wrap">

          {/* DATE */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-center sm:border-r sm:pr-4">
            <span className="text-xs font-bold uppercase text-[#565D6DFF]">
              {month}
            </span>
            <span className="text-[#171A1FFF] text-lg font-semibold">
              {day}
            </span>
          </div>

          {/* TYPE */}
          <div className="py-1 px-3 bg-[#eef6f0] rounded-3xl text-[#1A2E1CFF] font-medium">
            <p className="text-sm">{predictionType}</p>
          </div>

          {/* RISK */}
          <div
            className="py-1 px-3 rounded-3xl font-medium text-sm"
            style={{
              color: riskStyle.color,
              backgroundColor: riskStyle.backgroundColor,
            }}
          >
            {risk} Risk
          </div>

        </div>

        {/* PROGRESS BAR (MOBILE FULL WIDTH) */}
        <div className="flex flex-col gap-1 w-full sm:hidden mt-1">
          <ProgressBar value={confidence} />
          <span className="text-[#565D6DFF] text-xs">
            {confidence}% confidence
          </span>
        </div>

      </div>

      {/* DESKTOP RIGHT SIDE (UNCHANGED) */}
      <div className="hidden sm:flex flex-col gap-2 w-[160px] shrink-0">
        <ProgressBar value={confidence} />
        <span className="text-[#565D6DFF] text-sm">
          {confidence}% confidence
        </span>
      </div>

    </div>
  );
}