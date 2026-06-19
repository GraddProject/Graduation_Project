import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { useState, useEffect } from "react";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">

      <div
        className={`
          fixed top-0 left-0 h-screen z-50
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Navbar onClose={() => setOpen(false)} />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 w-full lg:ml-[230px]">

        <Header onMenuClick={() => setOpen(true)} />

        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}