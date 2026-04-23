import { useState } from "react";
import { Baby, ChevronLeft, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export default function AdminInterfaceNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/admindashboard", text: "Dashboard" },
    { to: "/createaccount", text: "Create User" },
  ];

  const currentPage = links.find(link => link.to === location.pathname)?.text || "";

  return (
    <div className="bg-white px-4 md:px-10 py-5 shadow-[0px_2px_4px_#00000012] backdrop-blur-[12px] relative z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-DarkGreen rounded-lg flex items-center justify-center">
            <Baby size={24} className="text-white" /> 
          </div>
          <h1 className="text-[20px] md:text-[22px] lg:text-[24px] font-extrabold text-DarkGreen">
            HerJourney
          </h1>
          <div className="w-[1px] h-6 bg-[#F0F3F0] hidden md:block ml-2"></div>
          <div className="flex-col gap-1 ml-3 hidden md:flex">
            <h2 className="text-[14px] md:text-[16px] lg:text-[18px] font-bold text-DarkGreen">
              {currentPage || "Dashboard"}
            </h2>
            <ul className="flex gap-3 w-fit">
              {links.map((link, idx) => (
                <li key={link.to} className="group relative mt-[-4px]">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-[13px] md:text-[14px] lg:text-[15px] transition ${
                        isActive ? "text-DarkGreen" : "text-[#A8B9AAFF]"
                      }`
                    }
                  >
                    {link.text}
                  </NavLink>
                  {idx < links.length - 1 && (
                    <span className="text-[#A8B9AAFF] ml-2 text-[12px] select-none">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3">
                    <div className="bg-[#F5FAF5FF] border border-grayBorder py-2 px-3 rounded-3xl">
            <p className="text-[#565D6DFF] font-bold text-sm">24 user</p>
          </div>
          <button
            className="md:hidden"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {dropdownOpen ? <X size={24} /> : <Menu size={24} />}
          </button>      
        </div>
        
      </div>
      {dropdownOpen && (
        <div className="md:hidden mt-2 py-2  flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[14px] font-semibold transition ${
                  isActive ? "text-DarkGreen" : "text-[#A8B9AAFF]"
                }`
              }
              onClick={() => setDropdownOpen(false)}
            >
              {link.text}
            </NavLink>
          ))}

        </div>
      )}


    </div>
  );
}