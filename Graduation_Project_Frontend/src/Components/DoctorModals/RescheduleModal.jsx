import { useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

const DURATIONS = [15, 30, 60];

function parseStartTime(timeStr) {
  try {
    const start = timeStr.split(" - ")[0]; 
    const [time, meridiem] = start.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  } catch {
    return "09:00";
  }
}

function parseDuration(durationStr) {
  const num = parseInt(durationStr);
  return isNaN(num) ? 60 : num;
}

function toISO(date, timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00.000Z`;
}

export default function RescheduleModal({ slot, token, onClose, onSaved }) {
  const [newDate, setNewDate]     = useState(slot.date || new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime]     = useState(() => parseStartTime(slot.time));
  const [duration, setDuration]   = useState(() => parseDuration(slot.duration));
  const [type, setType]           = useState(slot.type || "Online");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://her-journey-669913381811.us-central1.run.app/api/Doctor/appointments/${slot.id}/reschedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newStartAt: toISO(newDate, newTime),
            durationMinutes: duration,
            type,
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message || "Failed to reschedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Reschedule</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {slot.patientName ? `Patient: ${slot.patientName}` : slot.dateLabel}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">New date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">New start time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#2d4a2d]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Duration</label>
            <div className="grid grid-cols-3 gap-1.5">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-xl border text-xs font-medium transition-colors
                    ${duration === d
                      ? "bg-[#2d4a2d] border-[#2d4a2d] text-white"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["Online", "Offline"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl border text-xs font-medium transition-colors
                    ${type === t
                      ? "bg-[#eef4ee] border-[#2d4a2d] text-[#2d4a2d]"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#2d4a2d] text-white text-xs font-semibold hover:bg-[#3a6b3a] disabled:opacity-40 flex items-center gap-2 transition-colors"
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}