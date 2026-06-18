import React, { useState, useEffect, useCallback } from "react";
import { X, Bell, Check, CheckCheck, Calendar, RefreshCw, XCircle, Info } from "lucide-react";

const API_BASE = "https://her-journey-1044023551709.us-central1.run.app";

const API_HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const TYPE_CONFIG = {
  RescheduleRequested: {
    icon: <RefreshCw className="w-4 h-4" />,
    bg: "bg-blue-50",
    color: "text-blue-500",
    label: "Reschedule",
  },
  AppointmentCancelled: {
    icon: <XCircle className="w-4 h-4" />,
    bg: "bg-red-50",
    color: "text-red-400",
    label: "Cancelled",
  },
  RescheduleAccepted: {
    icon: <Check className="w-4 h-4" />,
    bg: "bg-green-50",
    color: "text-green-500",
    label: "Accepted",
  },
  RescheduleRejected: {
    icon: <XCircle className="w-4 h-4" />,
    bg: "bg-orange-50",
    color: "text-orange-400",
    label: "Rejected",
  },
  AppointmentBooked: {
    icon: <Calendar className="w-4 h-4" />,
    bg: "bg-primary-50",
    color: "text-[#4a7c59]",
    label: "Booked",
  },
  default: {
    icon: <Info className="w-4 h-4" />,
    bg: "bg-gray-50",
    color: "text-gray-400",
    label: "Notification",
  },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsPopup({ token, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Notifications`, {
        headers: API_HEADERS(token),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE}/api/Notifications/MarkAsRead/${notificationId}`, {
        method: "PUT",
        headers: API_HEADERS(token),
      });
      setNotifications((prev) =>
        prev.map((n) => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await fetch(`${API_BASE}/api/Notifications/MarkAllAsRead`, {
        method: "PUT",
        headers: API_HEADERS(token),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
    setMarkingAll(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[380px] max-h-[520px] flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#4a7c59]" />
            <h2 className="text-sm font-bold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-100 text-red-500 font-semibold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={markingAll}
                className="flex items-center gap-1 text-[11px] text-[#4a7c59] font-medium hover:underline disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-3/4 bg-gray-100 rounded" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-300">
              <Bell className="w-10 h-10 mb-2" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.default;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`flex items-start gap-3 px-5 py-3.5 transition-colors cursor-pointer
                    ${!n.isRead ? "bg-[#f5f8f5] hover:bg-[#eef4ef]" : "hover:bg-gray-50"}`}
                >

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} ${config.color}`}>
                    {config.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[13px] font-semibold text-gray-800 leading-snug
                        ${!n.isRead ? "font-bold" : ""}`}>
                        {n.title}
                      </p>
                   
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#4a7c59] flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}