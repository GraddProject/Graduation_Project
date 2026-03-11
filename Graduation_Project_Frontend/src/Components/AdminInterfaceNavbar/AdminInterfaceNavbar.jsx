import { Baby , ChevronLeft } from "lucide-react"
import { NavLink } from "react-router-dom"
export default function AdminInterfaceNavbar() {
    
    const links = [
        { to: "/dashboard", text: "Dashboard" },
        { to: "/userManagement", text: "User Management" },
        { to: "/createUser", text: "Create User" },
    ];


    return (
    <div className='bg-white px-10 py-3 flex flex-row justify-between shadow-[0px_2px_4px_#00000012,0px_0px_0px_#171a1f00] backdrop-blur-[12px]'>
        <div className="logo flex items-center gap-2 flex-row ">
            <div className="w-8 h-8 bg-DarkGreen rounded-lg flex items-center justify-center">
                <Baby size={20} className="text-white" />
            </div>
            <h1 className="text-[16px] md:text-[18px] lg:text-[20px] font-extrabold text-DarkGreen mr-2">
                HerJourney
            </h1>
            <div className="w-[1px] h-6 bg-[#F0F3F0]"></div>
            <div className="flex flex-col gap-0 ml-3">
                <h2 className="text-[10px] md:text-[12px] lg:text-[14px] font-bold text-DarkGreen p-0 m-0"> Create New User</h2>
                <div className="nav-content">
                    <ul className="flex gap-2 w-fit ">
                        {links.map((link, idx) => (
                            <li key={link.to} className="group relative mt-[-5px]">
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => ` text-[11px] transition ${
                                        isActive ? " text-DarkGreen" : "text-[#A8B9AAFF]"}`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                                {idx < links.length - 1 && <span className="text-[#A8B9AAFF] ml-2 text-[10px] select-none">/</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        <button className="back flex items-center ">
            <ChevronLeft size={15} className="text-DarkGreen" />
            <span className="text-DarkGreen text-[11px]  ml-1">Back to Directory</span>
        </button>






    </div>
  )
}
