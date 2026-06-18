import React, { useState, useEffect, useContext, useCallback } from "react";
import { Bell, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/User.context";
import { getInitials } from "../../helpers/getInitials";
import NotificationsPopup from "../NotificationsPopup/NotificationsPopup";

const API_BASE = "https://her-journey-1044023551709.us-central1.run.app";

export default function Header() {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const pageTitles = {
    "/doctor/dashboard": "Dashboard",
    "/doctor/appointments": "Appointments",
    "/doctor/prediction-history": "Prediction History",
    "/doctor/profile": "My Profile",
    "/patient/dashboard": "Dashboard",
    "/patient/medical-records": "My Medical Records",
    "/patient/upload-tests": "Upload Medical Tests",
    "/patient/predictions": "Prediction Reports",
    "/patient/profile": "My Profile",
  };

  let title = pageTitles[location.pathname];
  if (location.pathname.includes("/doctor/prediction")) title = "Predictions";
  if (location.pathname.includes("/doctor/prediction-history")) title = "Prediction History";
  if (location.pathname.includes("/doctor/patient-profile")) title = "Patient Profile";
  title = title || "HerJourney";

  const hideBack =
    location.pathname === "/doctor/dashboard" ||
    location.pathname === "/patient/dashboard";

  // Poll unread count every 30 seconds
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/Notifications/UnreadCount`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      // API returns a number directly or { count: number }
      setUnreadCount(typeof data === "number" ? data : data?.count ?? 0);
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // When popup closes, refresh unread count
  const handleCloseNotifications = () => {
    setShowNotifications(false);
    fetchUnreadCount();
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-10">
        <div className="flex flex-row items-center gap-5">
          {!hideBack && (
            <div
              className="flex flex-row items-center gap-1 text-[#4A5F4EFF] cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={18} className="text-[#4A5F4EFF]" />
              <span>Back</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Bell button */}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 min-w-[16px] h-4 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-[9px] text-white font-bold px-0.5">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </span>
            )}
          </button>

          {/* Avatar */}
          <div className="cursor-pointer" onClick={() => navigate("/patient/profile")}>
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                className="w-9 h-9 rounded-xl border object-cover"
                alt="profile"
              />
            ) : (
              getInitials(user?.displayName)
            )}
          </div>
        </div>
      </header>

      {/* Notifications popup */}
      {showNotifications && (
        <NotificationsPopup
          token={token}
          onClose={handleCloseNotifications}
        />
      )}
    </>
  );
}