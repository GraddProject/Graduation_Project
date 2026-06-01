import React from 'react'
import { useState } from 'react';
import { Leaf , HeartPulse } from 'lucide-react';
import PredictionTypeCard from '../PredictionTypeCard/PredictionTypeCard';

export default function SelectPredictionType() {
    const [predType, setPredType] = useState("GDM");
    return <>
          <div className='bg-white rounded-xl shadow mt-3 px-5 pl-4 py-4'>
            <h1 className='text-[#1A2E1CFF] mb-4 font-semibold'>
              Select Prediction Type
            </h1>
  
            <div className="flex gap-5 w-full">
    
              <PredictionTypeCard
                title="Gestational Diabetes (GDM)"
                desc="Screening for glucose intolerance during pregnancy."
                icon={Leaf}
                iconBg="bg-[#E8F5E8FF]"
                iconColor="text-[#4A6B4EFF]"
                value="GDM"
                selected={predType === "GDM"}
                onClick={() => setPredType("GDM")}
              />
  
              <PredictionTypeCard
                title="Preeclampsia"
                desc="Risk assessment for hypertension and organ damage."
                icon={HeartPulse}
                iconBg="bg-[#E8C5B14D]"
                iconColor="text-[#C97272FF]"
                value="PE"
                selected={predType === "PE"}
                onClick={() => setPredType("PE")}
              />
            </div>
          </div>
  
  
  
  </>
}
