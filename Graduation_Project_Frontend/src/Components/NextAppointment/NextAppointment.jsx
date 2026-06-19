import React, { useState, useEffect, useCallback, useContext } from "react";
import { RefreshCw, MapPin, Check, Calendar, Video, Loader2 } from "lucide-react";
import { UserContext } from "../../Components/context/User.context";

const API_HEADERS = (token) => ({
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json",
});
const API_BASE = "https://her-journey-1044023551709.us-central1.run.app/";

export default function NextAppointment() {
  const { token } = useContext(UserContext);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAppointment = useCallback(async () => {
    setLoading(true);
    try {
      const [confirmedRes, rescheduleRes] = await Promise.all([
        fetch(`${API_BASE}/api/Patient/GetMyAppointments?status=Confirmed`, { headers: API_HEADERS(token) }),
        fetch(`${API_BASE}/api/Patient/GetMyAppointments?status=ReschedulePending`, { headers: API_HEADERS(token) }),
      ]);
      const confirmed = confirmedRes.ok ? await confirmedRes.json() : [];
      const rescheduled = rescheduleRes.ok ? await rescheduleRes.json() : [];

      const nextConfirmed = Array.isArray(confirmed)
        ? confirmed.filter((a) => new Date(a.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0] ?? null
        : null;
      const nextReschedule = Array.isArray(rescheduled) ? rescheduled[0] ?? null : null;

      if (nextReschedule && nextConfirmed?.id === nextReschedule?.id) {
        setAppointment({ ...nextReschedule, isReschedulePending: true });
      } else if (nextReschedule) {
        setAppointment({ ...nextReschedule, isReschedulePending: true });
      } else {
        setAppointment(nextConfirmed ? { ...nextConfirmed, isReschedulePending: false } : null);
      }
    } catch {
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointment(); }, [fetchAppointment]);

  const handleAccept = async () => {
    if (!appointment) return;
    setActionLoading("accept");
    try {
      const res = await fetch(`${API_BASE}/api/Patient/AcceptReschedule?appointmentId=${appointment.id}`, { method: "PUT", headers: API_HEADERS(token) });
      const data = await res.json();
      if (data.status) { showToast("success", data.message ?? "Reschedule accepted!"); fetchAppointment(); }
      else showToast("error", data.message ?? "Something went wrong.");
    } catch { showToast("error", "Network error. Please try again."); }
    finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!appointment) return;
    setActionLoading("reject");
    try {
      const res = await fetch(`${API_BASE}/api/Patient/RejectReschedule?appointmentId=${appointment.id}`, { method: "PUT", headers: API_HEADERS(token) });
      const data = await res.json();
      if (data.status) { showToast("success", "Reschedule rejected. Please pick a new slot."); fetchAppointment(); }
      else showToast("error", data.message ?? "Something went wrong.");
    } catch { showToast("error", "Network error. Please try again."); }
    finally { setActionLoading(null); }
  };

  const parseDateParts = (dateStr) => {
    if (!dateStr) return { month: "—", day: "—", weekday: "—" };
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  };

  const original = parseDateParts(appointment?.date);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm relative">

      {toast && (
        <div className={`absolute top-3 right-3 left-3 rounded-xl px-4 py-2.5 text-sm font-medium text-center z-10
          ${toast.type === "success" ? "bg-primary-100/60 text-[#2d4a2d]" : "bg-red-50 text-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-textColor">Next Appointment</span>
        {!loading && appointment && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium
            ${appointment.isReschedulePending ? "bg-[#e8f1fa]/80 text-[#64809a]" : "bg-primary-100/50 text-[#4a7c59]"}`}>
            {appointment.isReschedulePending ? "Reschedule Pending" : "Confirmed"}
          </span>
        )}
      </div>

      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="flex gap-4">
            <div className="w-14 h-16 bg-gray-100 rounded-lg" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-36 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-20 bg-gray-50 rounded-xl" />
          <div className="flex gap-3">
            <div className="flex-1 h-11 bg-gray-200 rounded-xl" />
            <div className="flex-1 h-11 bg-gray-100 rounded-xl" />
          </div>
        </div>
      )}

      {!loading && !appointment && (
        <div className="text-center py-8 text-textColor/40">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No upcoming appointments.</p>
        </div>
      )}

      {!loading && appointment && !appointment.isReschedulePending && (
        <>
          <div className="flex gap-3 sm:gap-4 items-center sm:items-start">
            <div className="bg-primary-100/50 shadow-sm rounded-lg px-2.5 sm:px-3 py-2 text-center min-w-[48px] sm:min-w-[52px] shrink-0">
              <div className="text-[10px] text-textColor/50 uppercase tracking-wide">{original.month}</div>
              <div className="text-xl sm:text-2xl font-bold text-textColor leading-none">{original.day}</div>
              <div className="text-[10px] text-textColor/50">{original.weekday}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-textColor truncate">{appointment.doctorName}</div>
              <div className="text-xs sm:text-sm text-textColor/60 mt-0.5">{appointment.time} · {appointment.duration}</div>
              <div className="text-xs text-textColor/50 mt-0.5">{appointment.appointmentType}</div>
              <div className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full mt-2 font-medium
                ${appointment.isOnline ? "bg-blue-50 text-blue-500" : "bg-primary-100/50 text-textColor/70"}`}>
                {appointment.isOnline
                  ? <><Video className="w-2.5 h-2.5" /> Online</>
                  : <><MapPin className="w-2.5 h-2.5" /> In-Person</>
                }
              </div>
            </div>
          </div>

          {appointment.isOnline && appointment.canJoinOnlineSession && (
            <a
              href={appointment.onlineSessionUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 bg-DarkGreen hover:bg-DarkGreen/90 text-white rounded-xl py-3 text-sm font-medium transition-colors"
            >
              <Video className="w-4 h-4" />
              Join Session
            </a>
          )}
        </>
      )}

      {!loading && appointment && appointment.isReschedulePending && (
        <>
          <div className="flex gap-3 sm:gap-4 items-center sm:items-start mb-4">
            <div className="bg-primary-100/50 shadow-sm rounded-lg px-2.5 sm:px-3 py-2 text-center min-w-[48px] sm:min-w-[52px] shrink-0">
              <div className="text-[10px] text-textColor/40 uppercase tracking-wide">{original.month}</div>
              <div className="text-xl sm:text-2xl font-bold text-textColor/40 leading-none">{original.day}</div>
              <div className="text-[10px] text-textColor/40">{original.weekday}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-textColor/50 mb-0.5">Original booking</div>
              <div className="text-sm text-textColor/40 line-through truncate">{appointment.time} · {appointment.visitType ?? "In-Person"}</div>
              <div className="text-sm text-textColor/40 line-through truncate">{appointment.doctorName}</div>
            </div>
          </div>

          <div className="bg-[#e8f1fa]/60 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 text-[#64809a] text-xs font-medium mb-2">
              <RefreshCw className="w-3 h-3" />
              New time proposed
            </div>
            <div className="text-sm font-semibold text-gray-600 mb-2">
              {appointment.dateLabel ?? "—"} · {appointment.time}
            </div>
            <div className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full
              ${appointment.isOnline ? "bg-blue-50 text-blue-500" : "bg-primary-200 text-textColor/85"}`}>
              {appointment.isOnline
                ? <><Video className="w-2.5 h-2.5" /> Online</>
                : <><MapPin className="w-2.5 h-2.5" /> In-Person</>
              }
            </div>
          </div>

          <hr className="border-gray-200 my-3 sm:my-4" />

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={!!actionLoading}
              className="flex-1 bg-DarkGreen hover:bg-DarkGreen/90 disabled:opacity-60 text-white rounded-xl py-2.5 sm:py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {actionLoading === "accept" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={!!actionLoading}
              className="flex-1 border border-DarkGreen hover:bg-gray-50 disabled:opacity-60 text-DarkGreen rounded-xl py-2.5 sm:py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {actionLoading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              New Slot
            </button>
          </div>
        </>
      )}
    </div>
  );
}