import React from 'react'

export default function ClinicalDataCard({feature , value , unit}) {

   const getStatusColor = (feature, value) => {
  const v = Number(value);

  switch (feature) {
    case "Age":
      return v >= 35 ? "#C97272FF" : "#4A6B4EFF";

    case "BMI":
      if (v >= 30) return "#C97272FF";
      if (v >= 25) return "#DAA520FF";
      return "#4A6B4EFF";

    case "HDL":
      return v < 50 ? "#C97272FF" : "#4A6B4EFF";

    case "Systolic BP":
      return v >= 130 ? "#C97272FF" : "#4A6B4EFF";

    case "Diastolic BP":
      return v >= 80 ? "#C97272FF" : "#4A6B4EFF";

    case "OGTT":
      return v > 140 ? "#C97272FF" : "#4A6B4EFF";

    case "Hemoglobin":
      return v < 11 ? "#C97272FF" : "#4A6B4EFF";

    default:
      return "#667E68FF";
  }
};

  return <>
  
    <div className='bg-[#F6F8F7FF] w-full border py-2 px-3 border-[#DEE1E6FF] rounded-xl'>
        <div className='flex flex-row items-center justify-between'>
            <h3 className='text-xs text-[#565D6DFF] font-semibold uppercase'>{feature}</h3>
                <div className='w-2 h-2 -mt-1 rounded-full 'style={{ backgroundColor: getStatusColor(feature, value) }}></div>
        </div>
        <div className='flex flex-row items-center gap-1 mt-1'>
            <h3 className='text-[#171A1FFF] text-xl'>{value}</h3>
            <span className='text-xs text-[#565D6DFF] mt-1'>{unit}</span>
        </div>
    </div>
  
  </>
}
