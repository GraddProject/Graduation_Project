import React from "react";
import PredictionLevelCharts from "../PredictionLevelCharts/PredictionLevelCharts";

export default function PredictionRiskCard({ riskData }) {
  return (
    <div className="bg-white p-4 rounded-2xl border">
      <h2 className="text-sm font-semibold text-[#151915FF] mb-6">
        {riskData.title}
      </h2>

      <div className="flex w-full flex-row items-center gap-4">
        <div className="w-4/12">
          <PredictionLevelCharts
            values={[
              riskData.highLevelPatients,
              riskData.moderateLevelPatients,
              riskData.lowLevelPatients,
            ]}
            totalPatients={riskData.totalPatients}
          />
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col gap-3 w-full">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-[#C97272FF] rounded-full"></div>
                <span className="text-[#565D6DFF] font-semibold text-sm">
                  High Level
                </span>
              </div>
              <span className="text-[#565D6DFF] font-semibold text-sm">
                {riskData.highLevelPatients} patients
              </span>
            </div>

            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-[#DAA520FF] rounded-full"></div>
                <span className="text-[#565D6DFF] font-semibold text-sm">
                  Moderate Level
                </span>
              </div>
              <span className="text-[#565D6DFF] font-semibold text-sm">
                {riskData.moderateLevelPatients} patients
              </span>
            </div>

            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-[#4A6B4EFF] rounded-full"></div>
                <span className="text-[#565D6DFF] font-semibold text-sm">
                  Low Level
                </span>
              </div>
              <span className="text-[#565D6DFF] font-semibold text-sm">
                {riskData.lowLevelPatients} patients
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}