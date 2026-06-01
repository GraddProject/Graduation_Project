import { useState, useEffect, useCallback, useContext } from "react";
import {
  format,
  isSameDay,
  parseISO,
  startOfDay,
  addMinutes,
  isBefore,
} from "date-fns";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Loader2,
} from "lucide-react";
import { UserContext } from "../../Components/context/User.context";
import StatsCard from "../../Components/StatsCard/StatsCard";
import WeekStrip from "../../Components/WeekStrip/WeekStrip";
import AppointmentRow from "../../Components/AppointmentRow/AppointmentRow";

const BASE = "https://her-journey-1044023551709.us-central1.run.app/";
const STATUSES = ["Confirmed", "ReschedulePending", "Completed"];

const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4e6d4&color=2d4a2d&size=64`;

function parseTime(timeStr = "") {
  const [time, ampm] = timeStr.split(" ");
  let [h, m] = (time || "00:00").split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return { h, m };
}

function deriveDateLabel(dateStr) {
  if (!dateStr) return "";
  try {
    const apptDate = startOfDay(parseISO(dateStr));
    const todayDate = startOfDay(new Date());
    const diff = Math.round((apptDate - todayDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    return format(apptDate, "MMM d");
  } catch {
    return dateStr;
  }
}

function isAutoCompleted(appt) {
  try {
    const { h, m } = parseTime(appt.time);
    const durationMins = parseInt(appt.duration) || 30;
    const start = parseISO(
      `${appt.date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
    );
    return isBefore(addMinutes(start, durationMins), new Date());
  } catch {
    return false;
  }
}

function normalise(raw) {
  const date = (raw.date || "").substring(0, 10);
  const base = {
    ...raw,
    date,
    dateLabel: raw.dateLabel || deriveDateLabel(date),
    patientAvatar: avatar(raw.patientName || "?"),
  };
  const isCompleted =
    base.status === "Completed" ||
    (base.status !== "Pending" && isAutoCompleted(base));
  return { ...base, status: isCompleted ? "Completed" : base.status };
}

const TAB_FILTER = {
  All: (s) => s !== "Pending",
  Upcoming: (s) => s === "Confirmed" || s === "ReschedulePending",
  Completed: (s) => s === "Completed",
};

const TABS = Object.keys(TAB_FILTER);

export default function DoctorViewAppointments() {
  const { token } = useContext(UserContext);

  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [apptError, setApptError] = useState("");

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date());

 
const loadAppointments = useCallback(async () => {
  if (!token) return;

  setApptLoading(true);
  setApptError("");

  try {
    const res = await fetch(`${BASE}/api/Doctor/GetAppointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await res.text(); 

    if (!res.ok) {
      console.error("Backend error response:", text);
      throw new Error(text || "Failed to load appointments");
    }

    const data = JSON.parse(text);
    const list = Array.isArray(data) ? data : [];

    console.log("Raw appointments:", list);
    setAppointments(list.map(normalise));

  } catch (e) {
    setApptError(e.message || "Failed to load appointments.");
    console.error("Error fetching appointments:", e);
  } finally {
    setApptLoading(false);
  }
}, [token]);

  const loadSummary = useCallback(async () => {
    if (!token) return;
    setSummaryLoading(true);
    try {
      const res = await fetch(`${BASE}/api/Doctor/Summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAppointments();
    loadSummary();
  }, [loadAppointments, loadSummary]);

  useEffect(() => {
    const id = setInterval(() => {
      setAppointments((prev) =>
        prev.map((a) => {
          if (["Completed", "Pending"].includes(a.status)) return a;
          return isAutoCompleted(a) ? { ...a, status: "Completed" } : a;
        }),
      );
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const filtered = appointments.filter((a) => {
    const matchesDate = isSameDay(new Date(a.date), selectedDate);
    const matchesTab = TAB_FILTER[activeTab]?.(a.status) ?? true;
    return matchesDate && matchesTab;
  });

  const totalAppointments = summary?.totalAppointments ?? 0;
  const upcoming = summary?.upcoming ?? 0;
  const completed = summary?.completed ?? 0;
  const reschedulePending = summary?.reschedulePending ?? 0;

  return (
    <div className="flex-1 flex flex-col bg-primary-50/45 min-h-screen overflow-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">My Appointments</h1>
        <div className="flex items-center gap-4">
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-400 rounded-full" />
          </button>
          <img
            src={avatar("Doctor User")}
            alt="Profile"
            className="w-9 h-9 rounded-xl object-cover border border-gray-200"
          />
        </div>
      </header>

      <div className="flex-1 px-8 py-6 space-y-5">
        {/* Stats */}
        <div className="flex gap-4">
          <StatsCard
            icon={CalendarDays}
            value={summaryLoading ? "…" : totalAppointments}
            label="Total Appointments"
            text="This month"
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatsCard
            icon={Clock}
            value={summaryLoading ? "…" : upcoming}
            label="Upcoming"
            text="Next 7 days"
            iconBg="bg-primary-50"
            iconColor="text-DarkGreen/70"
            flag
          />
          <StatsCard
            icon={CheckCircle2}
            value={summaryLoading ? "…" : completed}
            label="Completed"
            text="This month"
            iconBg="bg-gray-100"
            iconColor="text-gray-500"
          />
          <StatsCard
            icon={AlertCircle}
            value={summaryLoading ? "…" : reschedulePending}
            label="Reschedule Pending"
            text="Needs action"
            iconBg="bg-red-50"
            iconColor="text-red-500"
            accent
          />
        </div>

        {/* Week strip */}
        <WeekStrip
          appointments={appointments}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Appointments table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Tabs + date label */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#2d4a2d] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {format(selectedDate, "EEEE, MMM d")}
            </span>
          </div>

          {/* Body */}
          <div className="px-4 py-2">
            {apptLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading
                appointments…
              </div>
            ) : apptError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-red-400 text-sm">
                <p>{apptError}</p>
                <button
                  onClick={loadAppointments}
                  className="text-xs underline text-gray-500 hover:text-gray-700"
                >
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">
                No appointments for this day.
              </p>
            ) : (
              filtered.map((appt) => (
                <AppointmentRow key={appt.id} appointment={appt} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
