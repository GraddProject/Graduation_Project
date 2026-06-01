import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import SlotRow from "../SlotRow/SlotRow";
import { WeekDropdown } from "../WeekDropdown/WeekDropdown";

const PAGE_SIZE = 4;
const ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekRange(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day + offsetWeeks * 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default function SlotList({
  title,
  subtitle,
  slots,
  loading,
  error,
  onRetry,
  deletingIds = [],
  isBooked,
  onEdit,
  onDelete,
  onDeleteAll,
  onAddSlot,
  onReschedule,
}) {
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [filterDay, setFilterDay] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  // ── Day counts always from full unfiltered slots ──
  const dayCounts = useMemo(
    () =>
      slots.reduce((acc, slot) => {
        if (!slot.date) return acc;
        const dateObj = new Date(slot.date);
        if (isNaN(dateObj)) return acc;
        const shortDay = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        });
        acc[shortDay] = (acc[shortDay] || 0) + 1;
        return acc;
      }, {}),
    [slots],
  );

  const availableDays = ORDER.filter((day) => dayCounts[day]);

  const filtered = useMemo(() => {
    let result = slots;

    if (filterDay) {
      result = result.filter((slot) => {
        if (!slot.date) return false;
        const d = new Date(slot.date);
        return (
          !isNaN(d) &&
          d.toLocaleDateString("en-US", { weekday: "short" }) === filterDay
        );
      });
    }

    if (filterType !== "All") {
      result = result.filter((slot) => slot.visitType === filterType);
    }

    if (filterDate === "CurrentWeek") {
      const { start, end } = getWeekRange(0);
      result = result.filter((slot) => {
        const d = new Date(slot.date);
        return d >= start && d <= end;
      });
    } else if (filterDate === "NextWeek") {
      const { start, end } = getWeekRange(1);
      result = result.filter((slot) => {
        const d = new Date(slot.date);
        return d >= start && d <= end;
      });
    }

    return result;
  }, [slots, filterDay, filterType, filterDate]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDayClick = (day) => {
    setFilterDay((prev) => (prev === day ? null : day));
    setPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Section Header ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)
        }
        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer select-none"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">{title}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold
              ${isBooked ? "bg-red-50 text-red-500" : "bg-[#eef4ee] text-[#2d4a2d]"}`}
            >
              {slots.length}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {!isBooked && slots.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-500 bg-red-50 text-xs font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 size={12} /> Delete all
            </button>
          )}

          {!isBooked && (
            <button
              onClick={onAddSlot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2d4a2d] text-white text-xs font-semibold hover:bg-[#3a6b3a] transition-colors"
            >
              <Plus size={13} /> Add Slot
            </button>
          )}

          <div className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 pointer-events-none">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          {/* ── Filter Bar ── */}
          <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3">
            {/* Day pills — always from full slot list */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableDays.length === 0 ? (
                <span className="text-xs text-gray-400">No days available</span>
              ) : (
                availableDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors
                      ${
                        filterDay === day
                          ? "bg-[#2d4a2d] border-[#2d4a2d] text-white"
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-[#2d4a2d] hover:text-[#2d4a2d]"
                      }`}
                  >
                    {day}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                      ${filterDay === day ? "bg-white text-[#2d4a2d]" : "bg-gray-200 text-gray-600"}`}
                    >
                      {dayCounts[day]}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Date filter */}
           
               <WeekDropdown
              value={filterDate}
              onChange={(val) => {
                setFilterDate(val);
                setPage(1);
              }}
            />
            
            {/* Type filter */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {["All", "Online", "Offline"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilterType(t);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors
                    ${
                      filterType === t
                        ? "bg-white shadow-sm text-gray-800"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Slot Rows ── */}
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-400 text-xs">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 gap-2 text-red-400 text-xs">
              <AlertCircle size={14} /> {error}
              <button onClick={onRetry} className="underline ml-1">
                Retry
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-10">
                  No slots found.
                </p>
              ) : (
                paginated.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    isBooked={isBooked}
                    isDeleting={deletingIds.includes(slot.id)}
                    onDelete={() => onDelete([slot.id])}
                    onEdit={onEdit}
                    onReschedule={onReschedule}
                  />
                ))
              )}
            </div>
          )}

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400">
              {filtered.length === 0
                ? "No slots"
                : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </p>

            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
