import React from 'react'
import { Download, Eye, FlaskConical } from 'lucide-react'
import { formatDate } from '../../helpers/formatDate'

export default function LabTestCard({mode, name, date , download , onClick }) {

    date = formatDate(date)
  return <>
   <div className={`bg-white  flex flex-row items-center justify-between  cursor-pointer ${ mode === "prediction" ? "min-w-fit gap-10 py-2 " : "w-full gap-2 border-b pb-3"}` } onClick={onClick}>
    <div className='flex flex-row items-center gap-3'>
        <div className="w-10 h-10 rounded-full bg-[#F5F0FAFF] flex items-center justify-center">
           <FlaskConical size={19} className="text-[#9B7CB6FF]" />
        </div>
        <div className='flex flex-col '>
            <h3 className='text-[#191B18FF] text-sm w-fit'>{name}</h3>
            <span className='text-[#acafaa] text-xs'>{date}</span>

        </div>
    </div>
    <div className='flex flex-row gap-2 items-center'>
        <div className='w-8 h-8 rounded-full bg-white border border-[#E8EBE8FF] flex items-center justify-center' onClick={onClick}>
            <Eye size={16} className="text-[#6B8CAFFF]" />
        </div>
        
        <div className='w-8 h-8 rounded-full bg-white border border-[#E8EBE8FF] flex items-center justify-center' onClick={download}>
            <Download size={16} className="text-[#5A8A5DFF]" />
        </div>

    </div>

     
   </div>
  
  </>
}
