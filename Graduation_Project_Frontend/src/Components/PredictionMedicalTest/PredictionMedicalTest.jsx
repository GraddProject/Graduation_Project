import React, { useState } from 'react';
import LabTestCard from '../LabTestCard/LabTestCard';

export default function PredictionMedicalTest({
  patientName,
  tests = [],
  handleOpenTest
}) {

  const [offset, setOffset] = useState(0);
  const cardWidth = 200;

  const nextTest = () => {
    if (offset < (tests.length - 3) * cardWidth) {
      setOffset(prev => prev + cardWidth);
    }
  };

  const prevTest = () => {
    if (offset > 0) {
      setOffset(prev => prev - cardWidth);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow mt-3 px-5 py-4'>

      <h1 className='text-[#1A2E1CFF] mb-4 font-semibold'>
        {patientName ? `${patientName} Medical Test` : "Loading..."}
      </h1>

      <div className="relative">

        <button
          onClick={prevTest}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          ‹
        </button>

        <button
          onClick={nextTest}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          ›
        </button>

        <div className="overflow-hidden mx-8">
          <div
            className="flex gap-5 transition-transform duration-300"
            style={{ transform: `translateX(-${offset}px)` }}
          >

            {tests.map((test) => (
              <LabTestCard
                key={test.id}
                mode={"prediction"}
                name={test.name}
                date={test.uploadedAt}
                onClick={() => handleOpenTest(test.id)}
              />
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}