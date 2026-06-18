import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  Building2,
  Calendar,
  Clock,
  Paperclip,
  Loader2,
} from "lucide-react";
import { UserContext } from "../../Components/context/User.context";
const API_HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const API_BASE = "https://her-journey-1044023551709.us-central1.run.app";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getWeekDays(referenceDate) {
  const date = new Date(referenceDate);
  const day = date.getDay(); 
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7)); 
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatWeekRange(days) {
  const opts = { month: "short", day: "numeric", year: "numeric" };
  const start = days[0].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = days[6].toLocaleDateString("en-US", opts);
  return `${start} – ${end}`;
}
function isSlotExpired(startAt) {
  return new Date(startAt) < new Date();
}
function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatEndTime(dateStr, durationMinutes) {
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() + durationMinutes);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function BookAppointmentModal({
  isOpen,
  onClose,
  doctor,
  onBooked,
}) {
  const { token } = useContext(UserContext);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [visitType, setVisitType] = useState("Online"); 
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    return monday;
  });
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState(null);

  const weekDays = getWeekDays(weekStart);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!isOpen) return;
    setSlots([]);
    setSelectedSlot(null);
    setSelectedDay(new Date());
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`${API_BASE}/api/Patient/GetAllAvailbleSlots`, {
          headers: API_HEADERS(token),
          cache: "no-store", 
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const allSlots = Array.isArray(data) ? data : [];

        console.log("Total slots:", allSlots.length);
        console.log(
          "Available slots:",
          allSlots.filter((s) => !s.isBooked).length,
        );
        console.log("Sample slot:", allSlots[0]);

        setSlots(allSlots);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [isOpen, token]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDay, visitType]);

  const slotsForDay = slots.filter((s) => {
    const slotDate = new Date(s.startAt);
    const typeMatch =
      visitType === "Online" ? s.type === "Online" : s.type === "Offline";
    return isSameDay(slotDate, selectedDay) && typeMatch;
  });

  const daysWithSlots = new Set(
    slots
      .filter((s) => {
        const typeMatch =
          visitType === "Online" ? s.type === "Online" : s.type === "Offline";
        return !s.isBooked && !isSlotExpired(s.startAt) && typeMatch;
      })
      .map((s) => new Date(s.startAt).toDateString()),
  );

  const handlePrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const handleNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    try {
      const requestBody = {
        slotId: selectedSlot.id,
        sessionName: `Appointment - ${selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`,
      };

      console.log("Sending body:", JSON.stringify(requestBody));
      console.log(
        "Slot id type:",
        typeof selectedSlot.id,
        "value:",
        selectedSlot.id,
      );
      console.log("Token:", token ? token.substring(0, 20) + "..." : "MISSING");

      const res = await fetch(`${API_BASE}/api/Patient/BookAppointment`, {
        method: "POST",
        headers: API_HEADERS(token),
        body: JSON.stringify(requestBody),
      });

      const text = await res.text();
      console.log("Raw response:", text); 

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server error: ${res.status} — ${text}`);
      }

      console.log("Parsed response:", data);
      console.log("Errors:", data?.errors);

      if (!res.ok) {
        const errorMsg =
          data?.errors?.[0] ??
          data?.errorMessage ??
          data?.message ??
          `Error ${res.status}`;
        showToast("error", errorMsg);

        if (data?.errors?.[0]?.toLowerCase().includes("no longer available")) {
          setSlots((prev) =>
            prev.map((s) =>
              s.id === selectedSlot.id ? { ...s, isBooked: true } : s,
            ),
          );
          setSelectedSlot(null);
        }
        return;
      }

      if (data.status) {
        showToast("success", data.message ?? "Appointment booked!");
        setTimeout(() => {
          onBooked?.();
          onClose();
        }, 1200);
      } else {
        showToast("error", data.message ?? "Booking failed.");
      }
    } catch (err) {
      console.error("BookAppointment exception:", err);
      showToast("error", err.message ?? "Network error. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (!isOpen) return null;

  const selectedDayLabel = selectedDay.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {toast && (
          <div
            className={`absolute top-3 left-3 right-3 z-10 rounded-xl px-4 py-2.5 text-sm font-medium text-center
            ${toast.type === "success" ? "bg-primary-100/60 text-[#2d4a2d]" : "bg-red-50 text-red-600"}`}
          >
            {toast.msg}
          </div>
        )}

        <div className="px-6 pt-6 pb-5">
        
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-[18px] font-bold text-[#1a2a1b]">
                Book an Appointment
              </h2>
              <p className="text-[12px] text-textColor/50 mt-0.5">
                Choose a time slot — we'll confirm your booking instantly
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#f5f8f5] rounded-xl px-4 py-3 flex items-center gap-3 mt-4 mb-5">
            <img
              src={
                doctor?.profileImageUrl ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.displayName ?? "Doctor")}&background=d4e6d4&color=2d4a2d&size=128`
              }
              alt={doctor?.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-[9px] font-semibold text-textColor/40 uppercase tracking-widest mb-0.5">
                Your Assigned Doctor
              </div>
              <div className="text-[14px] font-semibold text-[#1a2a1b]">
                {doctor?.displayName ?? "Dr. Sarah Mitchell"}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="text-[10px] font-semibold text-textColor/40 uppercase tracking-widest mb-2">
              Appointment Type
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setVisitType("Online")}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all
                  ${
                    visitType === "Online"
                      ? "border-[#4a7c59] bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                  ${visitType === "Online" ? "bg-[#4a7c59]/10" : "bg-gray-100"}`}
                >
                  <Video
                    className={`w-3.5 h-3.5 ${visitType === "Online" ? "text-[#4a7c59]" : "text-gray-400"}`}
                  />
                </div>
                <div>
                  <div
                    className={`text-[13px] font-semibold ${visitType === "Online" ? "text-[#1a2a1b]" : "text-gray-500"}`}
                  >
                    Online Visit
                  </div>
                  <div className="text-[10px] text-textColor/40">
                    Video consultation
                  </div>
                </div>
                {visitType === "Online" && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-[#4a7c59] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setVisitType("Offline")}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all
                  ${
                    visitType === "Offline"
                      ? "border-[#4a7c59] bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                  ${visitType === "Offline" ? "bg-[#4a7c59]/10" : "bg-gray-100"}`}
                >
                  <Building2
                    className={`w-3.5 h-3.5 ${visitType === "Offline" ? "text-[#4a7c59]" : "text-gray-400"}`}
                  />
                </div>
                <div>
                  <div
                    className={`text-[13px] font-semibold ${visitType === "Offline" ? "text-[#1a2a1b]" : "text-gray-500"}`}
                  >
                    In-Person Visit
                  </div>
                  <div className="text-[10px] text-textColor/40">
                    Visit the clinic
                  </div>
                </div>
                {visitType === "Offline" && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-[#4a7c59] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevWeek}
              className="flex items-center gap-1 text-[12px] text-textColor/50 hover:text-textColor transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev week
            </button>
            <span className="text-[13px] font-semibold text-[#1a2a1b]">
              {formatWeekRange(weekDays)}
            </span>
            <button
              onClick={handleNextWeek}
              className="flex items-center gap-1 text-[12px] text-[#4a7c59] font-medium hover:text-[#4a7c59]/80 transition-colors"
            >
              Next week <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-5">
            {weekDays.map((day, i) => {
              const isSelected = isSameDay(day, selectedDay);
              const hasSlots = daysWithSlots.has(day.toDateString());
              const isToday = isSameDay(day, new Date());
              const dayLabel = DAYS[day.getDay()];

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all
                    ${
                      isSelected
                        ? "bg-[#4a7c59] text-white"
                        : "hover:bg-gray-50 text-textColor/70"
                    }`}
                >
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide mb-1
                    ${isSelected ? "text-white/80" : "text-textColor/40"}`}
                  >
                    {dayLabel}
                  </span>
                  <span
                    className={`text-[15px] font-bold leading-none mb-1.5
                    ${isSelected ? "text-white" : "text-[#1a2a1b]"}`}
                  >
                    {day.getDate()}
                  </span>
                  <div
                    className={`w-1 h-1 rounded-full
                    ${
                      hasSlots
                        ? isSelected
                          ? "bg-white"
                          : "bg-[#4a7c59]"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mb-4">
            <div className="text-[12px] font-semibold text-[#1a2a1b] mb-3">
              Available times for {selectedDayLabel}
            </div>

            {loadingSlots ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : slotsForDay.length === 0 ? (
              <div className="text-center py-6 text-textColor/40 text-sm">
                No available slots for this day.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slotsForDay.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isBooked = slot.isBooked;
                  const isExpired = isSlotExpired(slot.startAt);
                  const isUnavailable = isBooked || isExpired;

                  return (
                    <button
                      key={slot.id}
                      disabled={isUnavailable}
                      onClick={() => !isUnavailable && setSelectedSlot(slot)}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all
          ${
            isUnavailable
              ? "border-gray-100 bg-gray-50 cursor-not-allowed"
              : isSelected
                ? "border-[#4a7c59] bg-[#4a7c59] text-white shadow-sm"
                : "border-gray-200 bg-white hover:border-[#4a7c59]/40 hover:bg-[#f5f8f5]"
          }`}
                    >
                      <span
                        className={`text-[13px] font-semibold line-through-if-unavailable
          ${
            isUnavailable
              ? "text-gray-300 line-through"
              : isSelected
                ? "text-white"
                : "text-[#1a2a1b]"
          }`}
                      >
                        {formatTime(slot.startAt)}
                      </span>
                      <span
                        className={`text-[10px] mt-0.5
          ${
            isUnavailable
              ? "text-gray-300"
              : isSelected
                ? "text-white/70"
                : "text-textColor/40"
          }`}
                      >
                        {isExpired
                          ? "Expired"
                          : isBooked
                            ? "Booked"
                            : `${slot.durationInMinutes} min`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedSlot && (
            <div className="bg-[#f5f8f5] rounded-xl px-4 py-3 flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e2ebe4] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#4a7c59]" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1a2a1b]">
                    {selectedDay.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-textColor/50">
                      <Clock className="w-3 h-3" />
                      {formatTime(selectedSlot.startAt)} –{" "}
                      {formatEndTime(
                        selectedSlot.startAt,
                        selectedSlot.durationInMinutes,
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#4a7c59] font-medium">
                      <Video className="w-3 h-3" />
                      {visitType === "Online"
                        ? "Online Visit"
                        : "In-Person Visit"}
                    </span>
                  </div>
                </div>
              </div>
              <Paperclip className="w-4 h-4 text-textColor/30 flex-shrink-0" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-[13px] text-textColor/50 hover:text-textColor transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || booking}
            className="flex items-center gap-2 bg-[#4a7c59] hover:bg-[#4a7c59]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-colors"
          >
            {booking ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Confirm Booking
            {!booking && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
