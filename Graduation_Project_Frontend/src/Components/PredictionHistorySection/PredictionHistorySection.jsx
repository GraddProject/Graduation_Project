import React from "react";
import { ChartSpline, RefreshCcw } from "lucide-react";
import PredictionHistoryCard from "../PredictionHistoryCard/PredictionHistoryCard";
import { useNavigate } from "react-router-dom";

export default function PredictionHistorySection({ predictionHistory, patientId,}) {

  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-2">

      <div className="flex flex-col bg-white border border-[#DEE1E6FF] shadow rounded-xl">

        <div className="header w-full pl-4 pr-3 bg-[#eef6f0] py-3 flex flex-row items-center justify-between">

          <div className="flex flex-row items-center gap-2">
            <ChartSpline size={20} className="text-[#4A5F4EFF]" />

            <h2 className="uppercase text-sm text-[#1A2E1CFF]">
              Prediction History
            </h2>
          </div>

          <div
            className="flex flex-row gap-1 p-2 rounded-lg items-center cursor-pointer"
            onClick={() => navigate(`/doctor/prediction/${patientId}`)}
          >
            <RefreshCcw size={17} className="text-[#4A5F4EFF]" />

            <h2 className="text-[#1A2E1CFF] text-sm flex flex-row items-center gap-1">
              <span className="hidden sm:flex">Run</span>
              Prediction
            </h2>
          </div>
        </div>

        <div>
          {predictionHistory?.map((prediction) => (
            <PredictionHistoryCard
              key={prediction.predictionRecordId}
              month={prediction.month}
              day={prediction.day}
              predictionType={prediction.predictionType}
              risk={prediction.risk}
              confidence={prediction.confidence}
            />
          ))}
        </div>

      </div>
    </div>
  );
}