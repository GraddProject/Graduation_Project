import React from "react";
import { Bell, ChevronLeft, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/User.context";
import { getInitials } from "../../helpers/getInitials";

export default function Header({ onMenuClick }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

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

  if (location.pathname.includes("/doctor/prediction")) {
    title = "Predictions";
  }
  if (location.pathname.includes("/doctor/prediction-history")) {
    title = "Prediction History";
  }
  if (location.pathname.includes("/doctor/patient-profile")) {
    title = "Patient Profile";
  }

  title = title || "HerJourney";

  const hideBack =
    location.pathname === "/doctor/dashboard" ||
    location.pathname === "/patient/dashboard";

  const handleProfileClick = () => {
  if (user?.role === "Doctor") {
    navigate("/doctor/profile");
  } else {
    navigate("/patient/profile");
  }
};

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-white border-b sticky top-0 z-10">
      
      <div className="flex items-center gap-3 sm:gap-5">
        
        <button
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        {!hideBack && (
          <div
            className="flex items-center gap-1 text-[#4A5F4EFF] cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} />
            <span className="text-sm sm:text-base">Back</span>
          </div>
        )}

        <h1 className="text-base sm:text-xl font-bold text-gray-800">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
          <Bell size={18} />
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full" />
        </button>

        <div
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border object-cover"
              alt="profile"
            />
          ) : (
            getInitials(user?.displayName)
          )}
        </div>
      </div>
    </header>
  );
}