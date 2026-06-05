import React from 'react'
import ProgressBar from '../ProgressBar/ProgressBar'

export default function PredictionHistoryCard({month , day, predictionType , risk , confidence}) {

  const riskStyles = {
  Low: {
    color: "#4A6B4E",
    backgroundColor: "#E6F4EA",
  },
  Medium: {
    color: "#DAA520FF",
    backgroundColor: "#fff8de",
  },
  High: {
    color: "#D7263D",
    backgroundColor: "#FDEAEA",
  },
};


  return <>
  <div className=' border-b px-3 py-4 flex flex-row gap-2 items-center justify-between w-full'>

    <div className='flex flex-row items-center gap-2'>

    <div className='text-[#565D6DFF] flex px-2 border-r pr-4 flex-col font-semibold items-center'>
      <span className='text-xs font-bold uppercase'>{month}</span>
      <spna className="text-[#171A1FFF] text-xl">{day}</spna>
    </div>

    <div className='flex items-center justify-between'>
      <div className='flex flex-row items-center gap-2'>
      <div className='py-1 px-3 bg-[#eef6f0] rounded-3xl text-[#1A2E1CFF] font-medium '>
         <p className='text-sm'>{predictionType}</p>
      </div>
      
        <div className='py-1 px-3 bg-[#f9f0e5] rounded-3xl text-[#b38719] font-medium   text-sm' style={riskStyles[risk]}>
           <p> {risk} Risk </p>
        </div>
      </div>

    </div>
    </div>

        <div className='flex flex-col gap-1'>
          <ProgressBar value={confidence}  />
           <span className='text-[#565D6DFF] text-sm'>{confidence}% confidence</span>
        </div>

  </div>
  </>
}
