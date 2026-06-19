import React, { useMemo } from "react";
import { FlaskConical } from "lucide-react";
import LabTestCard from "../LabTestCard/LabTestCard";

export default function LabTestsSection({ medicalTests, showAllTests, setShowAllTests, mode, handelDownloadTest, handleOpenTest,}) {
  
  const totalTests = medicalTests?.length || 0;
  const visibleTests = useMemo(() => {
    return showAllTests ? medicalTests : medicalTests.slice(0, 5);
  }, [showAllTests, medicalTests]);

  return (
    <div className="w-full bg-white rounded-xl shadow">

      <div className="header w-full bg-[#F5F0FAFF] px-3 py-3 flex flex-row items-center justify-between">

        <div className="flex flex-row items-center gap-2">
          <FlaskConical size={20} className="text-[#9B7CB6FF]" />

          <h2 className="text-[#1A2E1CFF]">Lab Tests</h2>

          <div className="px-2 py-0.5 rounded-2xl bg-[#9B7CB6FF] ml-1">
            <p className="text-white font-semibold text-xs">
              {totalTests}
            </p>
          </div>
        </div>

        {totalTests > 5 && (
          <button
            className="text-[#9B7CB6FF] text-sm"
            onClick={() => setShowAllTests((prev) => !prev)}
          >
            {showAllTests ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div className="px-3 mt-3 flex flex-col gap-3">
        {visibleTests.map((test) => (
          <LabTestCard
            key={test.id}
            name={test.testName}
            date={test.uploadedTime}
            mode={mode}
            download={() => handelDownloadTest(test.id, test.testName)}
            onClick={() => handleOpenTest(test.id)}
          />
        ))}
      </div>

    </div>
  );
}