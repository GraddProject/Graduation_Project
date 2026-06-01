import { Leaf, LayoutDashboard, CalendarDays, Users, FileText, Sparkles, Settings , Upload , Activity } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/User.context";
import { getInitials } from "../../helpers/getInitials";


export default function Navbar() {
  

  const { user } = useContext(UserContext);
    const doctorLinks = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/doctor/dashboard" },
    { label: "Appointments", icon: CalendarDays, to: "/doctor/appointments" },
    { label: "Prediction History", icon: Activity, to: "/doctor/prediction-history" },
    { label: "Profile Settings", icon: Settings, to: "/doctor/profile" },

  ];

  const patientLinks = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/patient" },
    { label: "Medical Records", icon: FileText, to: "/patient/medical-records" },
    { label: "Upload Tests", icon: Upload, to: "/patient/upload-tests" },
    { label: "Prediction Reports", icon: Sparkles, to: "/patient/predictions" },
    { label: "Profile Settings", icon: Settings, to: "/patient/profile" },
  ];

    const navItems =
    user?.role === "Doctor"
      ? doctorLinks
      : patientLinks;

  return (
    <div className="min-w-[220px] h-screen sticky top-0  bg-[#3e503e] flex flex-col pt-6 pb-4 px-4 shrink-0">

      <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-10 px-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
                <span className="text-white font-semibold">HerJourney</span>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map(({ label, icon: Icon, to }) => (
                <NavLink
                  key={to}
                  to={to}
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
          <div className="border-t border-t-[#FFFFFF1A] mt-auto">
            <div className="flex flex-row gap-2 items-center mt-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    className="w-10 h-10 rounded-full border object-cover"
                    alt="profile"
                  />
                  ) : getInitials(user?.displayName) 
                }
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">{user?.displayName}</h3>
                <p className="text-white/60 text-xs">{user?.email}</p>
              </div>
            </div>

          </div>
      </div>
    </div>
  );
}
