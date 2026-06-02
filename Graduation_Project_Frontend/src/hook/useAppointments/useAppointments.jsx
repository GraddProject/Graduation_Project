import { useState, useEffect, useCallback } from "react";
import { fetchAppointments } from "../../Components/DoctorProfile/DoctorApi";
import { format, parseISO, isBefore, startOfDay, addMinutes } from "date-fns";

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
    const apptDate  = startOfDay(parseISO(dateStr));
    const todayDate = startOfDay(new Date());
    const diff      = Math.round((apptDate - todayDate) / (1000 * 60 * 60 * 24));
    if (diff === 0)  return "Today";
    if (diff === 1)  return "Tomorrow";
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
      `${appt.date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
    );
    const end = addMinutes(start, durationMins);
    return isBefore(end, new Date());
  } catch {
    return false;
  }
}

function normalise(raw) {
 
  const date = (raw.date || "").substring(0, 10);

  const base = {
    ...raw,
    date,
    dateLabel:     raw.dateLabel || deriveDateLabel(date),
    patientAvatar: avatar(raw.patientName || "?"),
  };

  const isCompleted =
    base.status === "Completed" ||
    (base.status !== "Canceled" && base.status !== "Pending" && isAutoCompleted(base));

  return {
    ...base,
    status: isCompleted ? "Completed" : base.status,
  };
}

export function useAppointments(token) {
  const [appointments,    setAppointments]    = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAppointments(token); 
      const list = Array.isArray(data) ? data : [];
      setAppointments(list.map(normalise));
    } catch (e) {
      setError(e.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prev) =>
        prev.map((a) => {
          if (a.status === "Completed" || a.status === "Canceled" || a.status === "Pending")
            return a;
          return isAutoCompleted(a) ? { ...a, status: "Completed" } : a;
        })
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { appointments, loading, error, reload: load };
}