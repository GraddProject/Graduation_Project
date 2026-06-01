import { useState } from "react";
import { startOfWeek, addDays, addWeeks, format, isSameDay, isToday } from "date-fns";

export default function WeekStrip({ appointments = [], selectedDate, onSelectDate }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 }); 

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, "yyyy-MM-dd");

    const dots = appointments.filter((a) => a.date === dateStr).length;

    return {
      day: format(date, "EEE"),  
      date: format(date, "dd"),   
      fullDate: date,
      dots: Math.min(dots, 3),    
      isToday: isToday(date),
      isActive: selectedDate ? isSameDay(date, selectedDate) : isToday(date),
    };
  });

  const monthLabel = format(weekStart, "MMMM yyyy");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 h-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-base">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors text-xs"
          >‹</button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors text-xs"
          >›</button>
        </div>
      </div>

      <div className="flex gap-2">
        {days.map(({ day, date, dots, isActive, isToday: today, fullDate }) => (
          <button
            key={date + day}
            onClick={() => onSelectDate(fullDate)}
            className={`flex-1 flex flex-col items-center py-3 px-1 rounded-xl transition-all duration-150 ${
              isActive
                ? "border-[3px] border-DarkGreen/60 bg-primary-100/25 shadow-sm"
                : "hover:bg-gray-50"
            }`}
          >
            <span className="text-[12px] text-gray-400 mb-1">{day}</span>
            <span className={`text-lg font-semibold ${
              isActive ? "text-[#2d4a2d]" : today ? "text-blue-500" : "text-gray-700"
            }`}>
              {date}
            </span>
            {dots > 0 && (
              <div className="flex gap-0.5 mt-1.5">
                {Array.from({ length: dots }).map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${isActive ? "bg-[#3a6b3a]" : "bg-gray-300"}`} />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}