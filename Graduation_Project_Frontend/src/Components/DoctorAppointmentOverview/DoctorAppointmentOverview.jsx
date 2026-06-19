import React, { useState } from 'react'
import { ChevronDown } from "lucide-react";
import ProgressBar from '../ProgressBar/ProgressBar';
import MyChart from '../MyChart/MyChart';

export default function DoctorAppointmentOverview({ data, dateFilter, setDateFilter }) {

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

  const totalSlots = (onlineBookedSlots || 0) + (offlineBookedSlots || 0);

  const onlineBookedSlotsPercentage =
    totalSlots ? (onlineBookedSlots / totalSlots) * 100 : 0;

  const offlineBookedSlotsPercentage =
    totalSlots ? (offlineBookedSlots / totalSlots) * 100 : 0;

  const [isOpen, setIsOpen] = useState(false);

  const appointmentStats = [
    {
      label: "Confirmed",
      count: confirmedCount,
      percentage: confirmedPercentage,
      color: "#5A8A5DFF",
    },
    {
      label: "Completed",
      count: completedCount,
      percentage: completedPercentage,
      color: "#667E68FF",
    },
    {
      label: "Canceled",
      count: canceledCount,
      percentage: canceledPercentage,
      color: "#E57373FF",
    },
  ];

  const availabilityStats = [
    {
      label: "Booked",
      count: bookedSlots,
      color: "#667E68FF",
    },
    {
      label: "Available",
      count: availableSlots,
      color: "#171A1FFF",
    },
    {
      label: "Expired",
      count: expiredSlots,
      color: "#E57373FF",
    },
  ];

  return (
    <div className='flex flex-col lg:flex-row  gap-5 mt-5'>

      <div className='bg-white rounded-xl shadow mt-4 w-full lg:w-6/12 px-4 pt-4 pb-6 flex flex-col gap-5'>

        <div className='flex flex-row items-center justify-between w-full gap-3'>

          <div className='flex flex-col'>
            <h1 className='text-[#1A2E1CFF] font-semibold'>
              Appointment Overview
            </h1>
            <span className='text-xs text-[#565D6DFF] font-medium'>
              Monthly performance and distribution
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 border border-[#DEE1E6FF] rounded-lg px-3 py-2 text-sm"
            >
              {dateFilter === "ThisMonth" ? "This Month" : "Last Month"}
              <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
                {["ThisMonth", "LastMonth"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setDateFilter(type);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {type === "ThisMonth" ? "This Month" : "Last Month"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-5 mt-3'>
          {appointmentStats.map((item) => (
            <div key={item.label} className='flex flex-col gap-1'>
              <div className='flex flex-row justify-between'>
                <h2 className='text-sm text-[#171A1FFF]'>{item.label}</h2>
                <p className='text-sm font-semibold'>
                  {item.count}{" "}
                  <span className='text-[#565D6DFF] font-normal'>
                    ({item.percentage}%)
                  </span>
                </p>
              </div>

              <ProgressBar
                width="full"
                value={item.percentage}
                color={item.color}
              />
            </div>
          ))}
        </div>
      </div>


      <div className='bg-white rounded-xl shadow mt-4 w-full lg:w-6/12 p-4 flex flex-col'>

        <h1 className='text-[#1A2E1CFF] font-semibold'>
          My Availability
        </h1>

        <div className='flex flex-row items-center gap-2'>

          <MyChart percentage={bookedPercentage} />

          <div className='flex flex-col gap-2'>
            {availabilityStats.map((item) => (
              <div key={item.label} className='flex flex-row gap-1 items-center'>
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: item.color }}
                />
                <p className='text-sm font-semibold' style={{ color: item.color }}>
                  {item.label}: {item.count} Slots
                </p>
              </div>
            ))}
          </div>

        </div>

        <div className='flex flex-col gap-2 mt-3'>
          <h3 className='text-sm text-[#565D6DFF]'>Type Breakdown</h3>

          <ProgressBar
            width="full"
            value={onlineBookedSlotsPercentage}
            color="#5A8A5DFF"
            bgColor="#6B8CAFFF"
          />

          <div className='flex justify-between text-sm mt-1'>
            <span>Online: {onlineBookedSlots}</span>
            <span>Offline: {offlineBookedSlots}</span>
          </div>
        </div>

      </div>
    </div>
  );
}