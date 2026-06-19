import React, { useRef } from "react";
import LabTestCard from "../LabTestCard/LabTestCard";

export default function PredictionMedicalTest({
  patientName,
  tests = [],
  handleOpenTest,
  handelDownloadTest,
}) {
  const containerRef = useRef(null);

  const scrollAmount = 240; 

  const nextTest = () => {
    containerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const prevTest = () => {
    containerRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow mt-3 px-5 py-4">
      <h1 className="text-[#1A2E1CFF] mb-4 font-semibold">
        {patientName ? `${patientName} Medical Test` : "Loading..."}
      </h1>

      <div className="relative">
        {/* Prev Button */}
        <button
          onClick={prevTest}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          ‹
        </button>

        {/* Next Button */}
        <button
          onClick={nextTest}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          ›
        </button>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          className="overflow-x-hidden mx-8 flex gap-5 scroll-smooth"
        >
          {tests.map((test) => (
            <LabTestCard
              key={test.id}
              mode="prediction"
              name={test.name}
              date={test.uploadedAt}
              onClick={() => handleOpenTest(test.id)}
              download={() =>
                handelDownloadTest(test.id, test.name)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}