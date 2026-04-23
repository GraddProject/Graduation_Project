import { Leaf, LayoutDashboard, CalendarDays, Users, FileText, Sparkles, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/doctor/dashboard" },
  { label: "My Appointments", icon: CalendarDays, to: "/doctor/appointments" },
  { label: "My Patients", icon: Users, to: "/patients" },
  { label: "Predictions", icon: Sparkles, to: "/predictions" },
  { label: "Profile Settings", icon: Settings, to: "/settings" },
];

export default function Navbar() {
  return (
    <div className="w-[220px] min-h-screen bg-[#3e503e] flex flex-col py-6 px-4 shrink-0">
     
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
  );
}
