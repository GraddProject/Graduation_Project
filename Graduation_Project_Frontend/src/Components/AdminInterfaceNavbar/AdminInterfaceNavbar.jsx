import { useState } from "react";
import { Baby, ChevronLeft, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AdminInterfaceNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/userManagement", text: "User Management" },
    { to: "/createUser", text: "Create User" },
  ];

  return (
    <div className="bg-white px-4 md:px-10 py-3 shadow-[0px_2px_4px_#00000012] backdrop-blur-[12px] relative z-20">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-DarkGreen rounded-lg flex items-center justify-center">
            <Baby size={20} className="text-white" />
          </div>
          <h1 className="text-[16px] md:text-[18px] lg:text-[20px] font-extrabold text-DarkGreen">
            HerJourney
          </h1>
          <div className="w-[1px] h-6 bg-[#F0F3F0] hidden md:block ml-2"></div>
          <div className=" flex-col gap-0 ml-3 hidden md:flex">
            <h2 className="text-[10px] md:text-[12px] lg:text-[14px] font-bold text-DarkGreen">
              Create New User
            </h2>
            <ul className="flex gap-2 w-fit">
              {links.map((link, idx) => (
                <li key={link.to} className="group relative mt-[-5px]">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-[11px] transition ${
                        isActive ? "text-DarkGreen" : "text-[#A8B9AAFF]"
                      }`
                    }
                  >
                    {link.text}
                  </NavLink>
                  {idx < links.length - 1 && (
                    <span className="text-[#A8B9AAFF] ml-2 text-[10px] select-none">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="md:hidden"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {dropdownOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button className="hidden md:flex items-center ml-4">
            <ChevronLeft size={15} className="text-DarkGreen" />
            <span className="text-DarkGreen text-[11px] ml-1">Back to Directory</span>
          </button>
        </div>
      </div>

      {dropdownOpen && (
        <div className="md:hidden mt-2 bg-white shadow-md rounded-md py-2 px-4 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[12px] font-semibold transition ${
                  isActive ? "text-DarkGreen" : "text-[#A8B9AAFF]"
                }`
              }
              onClick={() => setDropdownOpen(false)}
            >
              {link.text}
            </NavLink>
          ))}

          <button
            className="flex items-center text-[12px] text-DarkGreen font-semibold mt-1"
            onClick={() => setDropdownOpen(false)}
          >
            <ChevronLeft size={15} className="mr-1" />
            Back to Directory
          </button>
        </div>
      )}
    </div>
  );
}