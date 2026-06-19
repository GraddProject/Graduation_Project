import { Leaf, LayoutDashboard, CalendarDays, FileText, Settings, Upload, Activity,} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/User.context";
import { getInitials } from "../../helpers/getInitials";
import { useLocation } from "react-router-dom";

export default function Navbar({ onClose }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const doctorLinks = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/doctor/dashboard" },
    { label: "Appointments", icon: CalendarDays, to: "/doctor/appointments" },
    { label: "Prediction History", icon: Activity, to: "/doctor/prediction-history" },
    { label: "Profile Settings", icon: Settings, to: "/doctor/profile" },
  ];

  const patientLinks = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/patient/dashboard" },
    { label: "Medical Records", icon: FileText, to: "/patient/medical-records" },
    { label: "Upload Tests", icon: Upload, to: "/patient/upload-tests" },
    { label: "Profile Settings", icon: Settings, to: "/patient/profile" },
  ];

  const navItems = user?.role === "Doctor" ? doctorLinks : patientLinks;
  const handleProfileClick = () => {
  onClose?.();

  if (user?.role === "Doctor") {
    navigate("/doctor/profile");
  } else {
    navigate("/patient/profile");
  }
};

  return (
    <div className=" min-w-[230px] h-screen bg-[#3e503e] flex flex-col pt-6 pb-4 px-4 sticky ">

      <div className="flex flex-col justify-between h-full">
        <div>
          <div
            className="flex items-center gap-2 mb-10 px-2 cursor-pointer"
            onClick={() => onClose?.()}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold">HerJourney</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => onClose?.()}   
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-t-[#FFFFFF1A] mt-auto pt-3">
          <div
            className="flex flex-row gap-2 items-center cursor-pointer"
          
            onClick={handleProfileClick}
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  className="w-10 h-10 object-cover"
                  alt="profile"
                />
              ) : (
                getInitials(user?.displayName)
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-white font-medium text-sm truncate">
                {user?.displayName}
              </h3>
              <p className="text-white/60 text-xs truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}