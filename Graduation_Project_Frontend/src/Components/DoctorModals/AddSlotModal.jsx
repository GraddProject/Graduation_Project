import { useState } from "react";
import axios from "axios";
import { X, Check, Loader2, AlertCircle, Globe, Building2 } from "lucide-react";

const API_BASE = "https://her-journey-669913381811.us-central1.run.app";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DURATIONS = [15, 30, 60];
const STEP_LABELS = ["Days & Period", "Hours", "Session", "Review"];
const DAY_TO_INT = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
const toISO = (date, time) => {
  const dt = new Date(`${date}T${time}:00`); 
  return dt.toISOString();
};

export default function AddSlotModal({ token, onClose, onSaved }) {
  const [step, setStep] = useState(1);

  // Step 1 — Days & Period
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [repeatForWeeks, setRepeatForWeeks] = useState(1);

  // Step 2 — Hours
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  // Step 3 — Session
  const [duration, setDuration] = useState(60);
  const [sessType, setSessType] = useState("Online");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeToMins = (t) => {
    const [h, m] = (t || "00:00").split(":").map(Number);
    return h * 60 + m;
  };

  const toggleDay = (day) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const totalMins = Math.max(0, timeToMins(endTime) - timeToMins(startTime));
  const slotsPerDay = Math.floor(totalMins / duration);
  const slotsTotal = slotsPerDay * selectedDays.length * repeatForWeeks;

  const canProceed = () => {
    if (step === 1)
      return selectedDays.length > 0 && startDate && repeatForWeeks >= 1;
    if (step === 2) return timeToMins(endTime) > timeToMins(startTime);
    return true;
  };

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const payload = {
        startDate: `${startDate}T00:00:00.000Z`,
        daysOfWeek: selectedDays, 
        startTime: `${startTime}:00`, 
        endTime: `${endTime}:00`, 
        sessionDurationInMinutes: duration,
        type: sessType,
        repeatForWeeks,
      };
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      const { data } = await axios.post(
        `${API_BASE}/api/Doctor/AddWeeklyAvailabilitySlotsAsync`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data?.status === false) {
        setError(data.message || "Failed to add slots.");
        return;
      }

      onSaved();
      onClose();
    } catch (e) {
      console.log("Status:", e.response?.status);
      console.log("Response data:", JSON.stringify(e.response?.data, null, 2));
      console.log("Response headers:", e.response?.headers);
      setError(
        e.response?.data?.message || e.message || "Failed to add slots.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Add availability
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Set your weekly schedule
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Step Bar ── */}
        <div className="flex px-6 py-3 border-b border-gray-100">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div
                key={n}
                className="flex-1 flex flex-col items-center gap-1 relative"
              >
                {n < STEP_LABELS.length && (
                  <div
                    className={`absolute top-2.5 left-1/2 w-full h-px transition-colors ${done ? "bg-[#2d4a2d]" : "bg-gray-200"}`}
                  />
                )}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold z-10 border transition-colors
                  ${
                    done
                      ? "bg-[#eef4ee] border-[#c8ddc8] text-[#2d4a2d]"
                      : active
                        ? "bg-[#2d4a2d] border-[#2d4a2d] text-white"
                        : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {done ? <Check size={10} /> : n}
                </div>
                <span
                  className={`text-[10px] ${active ? "text-[#2d4a2d] font-semibold" : "text-gray-400"}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 max-h-[420px] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          {/* Step 1 — Days & Period */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">
                  Select working days
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex flex-col items-center py-2.5 rounded-xl border text-[10px] font-medium transition-colors
                        ${
                          selectedDays.includes(day)
                            ? "bg-[#eef4ee] border-[#2d4a2d] text-[#2d4a2d]"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                    >
                      <span className="text-xs font-semibold">
                        {day.slice(0, 1)}
                      </span>
                      <span className="mt-0.5">{day.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">
                  Repeat for how many weeks?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((w) => (
                    <button
                      key={w}
                      onClick={() => setRepeatForWeeks(w)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-colors
                        ${
                          repeatForWeeks === w
                            ? "bg-[#2d4a2d] border-[#2d4a2d] text-white"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      {w === 1 ? "1 week" : `${w} weeks`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Hours */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">
                  Working hours
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1.5">
                      Start time
                    </p>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1.5">End time</p>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
                    />
                  </div>
                </div>
                {timeToMins(endTime) <= timeToMins(startTime) && (
                  <p className="text-xs text-red-400 mt-1.5">
                    End time must be after start time.
                  </p>
                )}
              </div>

              {/* Visual time range preview */}
              {timeToMins(endTime) > timeToMins(startTime) && (
                <div className="bg-[#eef4ee] rounded-xl px-4 py-3 border border-[#c8ddc8]">
                  <p className="text-xs text-[#2d4a2d] font-semibold mb-1">
                    Working window
                  </p>
                  <p className="text-sm font-bold text-[#2d4a2d]">
                    {startTime} → {endTime}
                    <span className="text-xs font-normal ml-2 opacity-70">
                      ({Math.floor(totalMins / 60)}h{" "}
                      {totalMins % 60 > 0 ? `${totalMins % 60}m` : ""} total)
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Session */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">
                  Session type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "Online", icon: Globe, desc: "Video call" },
                    { type: "Offline", icon: Building2, desc: "In-clinic" },
                  ].map(({ type, icon: Icon, desc }) => (
                    <button
                      key={type}
                      onClick={() => setSessType(type)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors
                        ${
                          sessType === type
                            ? "bg-[#eef4ee] border-[#2d4a2d] text-[#2d4a2d]"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <Icon
                        size={16}
                        className={
                          sessType === type ? "text-[#2d4a2d]" : "text-gray-400"
                        }
                      />
                      <div className="text-left">
                        <p className="font-semibold">{type}</p>
                        <p
                          className={`text-[10px] font-normal ${sessType === type ? "text-[#3a6b3a]" : "text-gray-400"}`}
                        >
                          {desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">
                  Session duration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-colors
                        ${
                          duration === d
                            ? "bg-[#2d4a2d] border-[#2d4a2d] text-white"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2.5">
                <ReviewRow label="Days" value={selectedDays.join(", ")} />
                <ReviewRow label="Start date" value={startDate} />
                <ReviewRow
                  label="Repeats"
                  value={`${repeatForWeeks} week${repeatForWeeks > 1 ? "s" : ""}`}
                />
                <ReviewRow label="Hours" value={`${startTime} → ${endTime}`} />
                <ReviewRow
                  label="Session"
                  value={`${sessType}, ${duration} min`}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <StatBox value={slotsPerDay} label="Slots/day" green />
                <StatBox
                  value={slotsPerDay * selectedDays.length}
                  label="Slots/week"
                />
                <StatBox value={slotsTotal} label="Total slots" />
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                Slots will be created every {selectedDays.join(", ")} from{" "}
                {startDate} for {repeatForWeeks} week
                {repeatForWeeks > 1 ? "s" : ""}.
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-white transition-colors"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          <span className="text-xs text-gray-400">
            Step {step} of {STEP_LABELS.length}
          </span>
          <button
            onClick={() =>
              step < STEP_LABELS.length ? setStep(step + 1) : handleSave()
            }
            disabled={!canProceed() || loading}
            className="px-4 py-2 rounded-xl bg-[#2d4a2d] text-white text-xs font-semibold hover:bg-[#3a6b3a] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            {step === STEP_LABELS.length ? "Save slots ✓" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function StatBox({ value, label, green = false }) {
  return (
    <div
      className={`flex flex-col items-center py-3 rounded-xl border ${green ? "bg-[#eef4ee] border-[#c8ddc8]" : "bg-gray-50 border-gray-200"}`}
    >
      <span
        className={`text-xl font-bold ${green ? "text-[#2d4a2d]" : "text-gray-800"}`}
      >
        {value}
      </span>
      <span
        className={`text-[10px] mt-0.5 ${green ? "text-[#3a6b3a]" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
