import { Pen, Trash2, ChevronDown, Mail, UserCheck, Phone, Stethoscope } from "lucide-react";
import { useState } from "react";

export default function DashboardUserRow({ role, user, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>

      <div className={`hidden sm:grid grid-cols-[0.3fr_1.7fr_1.8fr_1.2fr_1.5fr_1fr_100px] items-center pl-4 pr-2 py-4  border-b border-t ${open ? "bg-[#F3F8F4]" : "bg-white"}`}>

        <div>
          <input type="checkbox" className="form-checkbox h-4 w-4 text-[#565D6DFF]" />
        </div>

        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="User Avatar" className="w-9 h-9 rounded-full" />
          <span className="font-bold text-[#2C3E2FFF] text-[15px]">{user.name}</span>
        </div>

        <div className="flex items-center gap-2 text-[#7A8F7CFF]">
          <Mail size={16} />
          <span className="text-[16px]">{user.email}</span>
        </div>

        <div className="bg-[#E8F5E9FF] rounded-full text-[#667E68FF] flex items-center gap-2 w-fit px-3 py-1">
          <UserCheck size={16} />
          <span className="text-sm">{role}</span>
        </div>

        <div className="flex items-center gap-2 text-[#7A8F7CFF]">
          <Phone size={16} />
          <span className="text-[16px]">{user.phone}</span>
        </div>

        <div>
          <span className="text-[16px] text-[#7A8F7CFF]">{user.registered}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button onClick={() => onEdit(user)}>
            <Pen size={18} className="text-[#667E68FF]" />
          </button>

          <button onClick={() => onDelete(user)}>
            <Trash2 size={18} className="text-red-700" />
          </button>

          <button className={role === "Patient" ? "" : "invisible"} onClick={() => setOpen(!open)}>
            <ChevronDown
              size={18}
              className={`text-[#A8B9AAFF] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className={`col-span-full ml-10 overflow-hidden transition-all duration-300 ease-in-out ${open && role === "Patient" ? "max-h-40 mt-4" : "max-h-0"}`}>
          <div className="p-4 rounded-lg grid grid-cols-4 gap-4">

            <div className="flex flex-col gap-2 text-xs">
              <p className="text-[#A8B9AAFF] font-bold">Blood Type</p>
              <p className="font-bold text-[#2C3E2FFF]">{user.blood || "-"}</p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <p className="text-[#A8B9AAFF] font-bold">Date of Birth</p>
              <p className="font-bold text-[#2C3E2FFF]">{user.dob || "-"}</p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <p className="text-[#A8B9AAFF] font-bold">Pregnancy Status</p>
              <p className="font-bold text-[#667E68FF]">
                Week {user.week || "-"} (Trimester {user.week ? Math.ceil(user.week / 12) : "-"})
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <p className="text-[#A8B9AAFF] font-bold">Assigned Doctor</p>
              <div className="flex items-center gap-1">
                <Stethoscope size={16} className="text-[#2196F3FF]" />
                <p className="font-bold text-[#2C3E2FFF]">{user.doctor || "-"}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="sm:hidden bg-white rounded-xl shadow-md p-4 mb-3 border">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-12 h-12 rounded-full" />

            <div>
              <p className="font-bold">{user.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail size={12} />
                {user.email}
              </div>
            </div>
          </div>

          <div className="bg-[#E8F5E9FF] px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <UserCheck size={14} />
            {role}
          </div>
        </div>

        <div className="mt-3 text-sm space-y-2 text-gray-600">

          <div className="flex items-center gap-2">
            <Phone size={14} />
            {user.phone}
          </div>

          <div>
            <span className="font-semibold">Registered:</span> {user.registered}
          </div>

          {role === "Patient" && open && (
            <>
              <div><b>Blood:</b> {user.blood || "-"}</div>
              <div><b>DOB:</b> {user.dob || "-"}</div>
              <div>
                <b>Week:</b> {user.week || "-"} (Trimester {user.week ? Math.ceil(user.week / 12) : "-"})
              </div>
              <div className="flex items-center gap-1">
                <Stethoscope size={14} />
                {user.doctor || "-"}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button onClick={() => onEdit(user)}>
            <Pen size={18} className="text-[#667E68FF]" />
          </button>

          <button onClick={() => onDelete(user)}>
            <Trash2 size={18} className="text-red-700" />
          </button>

          {role === "Patient" && (
            <button onClick={() => setOpen(!open)}>
              <ChevronDown
                size={18}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
}






