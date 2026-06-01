import React from 'react'
import { useState } from 'react';
import { ChevronDown } from "lucide-react";
import ProgressBar from '../ProgressBar/ProgressBar';
import CricleProgress from '../CircleProgress/CircleProgress';
import MyChart from '../MyChart/MyChart';

export default function DoctorAppointmentOverview({data , dateFilter , setDateFilter }) {

    const appointment = data?.appointmentOverview;
    const availability = data?.availability;

    const confirmedCount = appointment?.confirmed?.count;
    const completedCount = appointment?.completed?.count;
    const canceledCount = appointment?.canceled?.count;
    const confirmedPercentage = appointment?.confirmed?.percentage;
    const completedPercentage = appointment?.completed?.percentage;
    const canceledPercentage = appointment?.canceled?.percentage;


    const bookedPercentage = availability?.bookedPercentage;
    const bookedSlots = availability?.bookedSlots;
    const availableSlots = availability?.availableSlots;
    const onlineBookedSlots = availability?.onlineBookedSlots;
    const offlineBookedSlots = availability?.offlineBookedSlots;
    const expiredSlots = availability?.expiredSlots;
    const totalSlots = onlineBookedSlots + offlineBookedSlots;
    const [selectedPeriod, setSelectedPeriod] = useState("This Month");
const [isOpen, setIsOpen] = useState(false);
    

    const onlineBookedSlotsPercentage = totalSlots ? (onlineBookedSlots / totalSlots) * 100 : 0;
    const offlineBookedSlotsPercentage = totalSlots ? (offlineBookedSlots / totalSlots) * 100 : 0;




  return <>
  <div className='flex flex-row gap-5 '>
    <div className='bg-white rounded-xl  shadow mt-4 w-6/12  px-4 pt-4 pb-6 flex flex-col gap-5 '>
        <div className='flex flex-row items-center justify-between w-full gap-3'>
            <div className='flex flex-col items-start justify-center'>
                <h1 className='text-[#1A2E1CFF]  font-semibold'>
                    Appointment Overview
                </h1>
                <span className='text-xs text-[#565D6DFF] font-medium'>Monthly performance and distribution</span>
            </div>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 border border-[#DEE1E6FF] rounded-lg px-3 py-2 text-sm"
                >
                    {dateFilter === "ThisMonth" ? "This Month" : "Last Month"}
                        <ChevronDown size={16} className={`transition-transform ${ isOpen ? "rotate-180" : "" }`} />
                </button>

                {isOpen && (
                    <div className="absolute left-0 mt-2  bg-white border border-[#DEE1E6FF] rounded-lg shadow-lg z-50">
                        <button
                            onClick={() => {
                            setDateFilter("ThisMonth");
                            setIsOpen(false);
                            }}
                            className="w-full py-2 text-start px-3 hover:bg-gray-100  text-sm"
                        >
                            This Month
                        </button>

                        <button
                            onClick={() => {
                            setDateFilter("LastMonth");
                            setIsOpen(false);
                            }}
                            className="w-full text-start px-3  py-2 hover:bg-gray-100 text-sm"
                        >
                            Last Month
                        </button>
                  </div>
                )}
            </div>


        </div>

        <div className='flex flex-col gap-5 mt-3 '>
            <div className='flex flex-col gap-1'>
                <div className='flex flex-row items-center justify-between'>
                    <h2 className='text-[#171A1FFF] text-sm'>Confirmed</h2>
                    <p className='text-[#171A1FFF] font-semibold text-sm'>{confirmedCount} <span className='text-[#565D6DFF] font-normal text-sm'>({confirmedPercentage}%)</span></p>
                </div>
                <ProgressBar width={'full'} value={confirmedPercentage} color={'#5A8A5DFF'} />
            </div>
            
            <div className='flex flex-col gap-1'>
                <div className='flex flex-row items-center justify-between'>
                    <h2 className='text-[#171A1FFF] text-sm'>Completed</h2>
                    <p className='text-[#171A1FFF] font-semibold text-sm'>{completedCount} <span className='text-[#565D6DFF] font-normal text-sm'>({completedPercentage}%)</span></p>
                </div>
                <ProgressBar width={'full'} value={completedPercentage} color={'#667E68FF'} />
            </div>
                        
            <div className='flex flex-col gap-1'>
                <div className='flex flex-row items-center justify-between'>
                    <h2 className='text-[#171A1FFF] text-sm'>Canceled</h2>
                    <p className='text-[#171A1FFF] font-semibold text-sm'>{canceledCount} <span className='text-[#565D6DFF] font-normal text-sm'>({canceledPercentage}%)</span></p>
                </div>
                <ProgressBar width={'full'} value={canceledPercentage} color={'#E57373FF'} />
            </div>

        </div>

    </div>
    <div className='bg-white rounded-xl shadow mt-4 w-6/12  p-4 flex flex-col '>
        <div>
            <h1 className='text-[#1A2E1CFF]  font-semibold'>
                My Availability
            </h1>
        </div>


       <div className='flex flex-row items-center gap-2'>
        <div className='  border-[#DEE1E699] '>
          <MyChart percentage={bookedPercentage}/>
        </div>

        <div className='flex flex-col gap-2  justify-between '>
            <div className='flex flex-row gap-1  px-3  items-center '>
                <div className='w-2 h-2 rounded-full bg-[#667E68FF]'></div>
                <p className='text-[#667E68FF] font-semibold text-sm '>Booked:</p>
                <span className='text-[#667E68FF] font-semibold text-sm'>{bookedSlots} Slots</span>
            </div>
            
            <div className='flex flex-row gap-1  px-3  items-center  '>
                <div className='w-2 h-2 rounded-full bg-[#171A1FFF]'></div>
                <p className='text-[#171A1FFF] font-semibold text-sm '>Available:</p>
                <span className='text-[#171A1FFF] font-semibold text-sm'>{availableSlots} Slots</span>
            </div>
            <div className='flex flex-row gap-1 px-3 items-center'>
                <div className='w-2 h-2 rounded-full bg-[#E57373FF]'></div>
                <p className='text-[#E57373FF] font-semibold text-sm '> Expired: </p>
                <span className='text-[#E57373FF] font-semibold text-sm'> {expiredSlots} Slots </span>
            </div>

        </div>
        </div>

        <div className='flex flex-col gap-2'>
            <h3 className='text-[#565D6DFF] text-sm '>Type Breakdown</h3>
            <ProgressBar width={'full'} value={onlineBookedSlotsPercentage} color={'#5A8A5DFF'} bgColor={'#6B8CAFFF'} />
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-1 mt-1'>
                    <div className='w-3 h-3 rounded-full bg-[#5A8A5DFF]'></div>
                    <span className='font-semibold text-[#5A8A5DFF] text-sm'>Online:{onlineBookedSlots}</span>
                </div>
                
                <div className='flex flex-row items-center gap-1 mt-1'>
                    <div className='w-3 h-3 rounded-full bg-[#6B8CAFFF]'></div>
                    <span className='font-semibold text-[#6B8CAFFF] text-sm'>Offline:{offlineBookedSlots}</span>
                </div>

            </div>
        </div>

    </div>
  </div>
  </>
}
