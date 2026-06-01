import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Navbar />

      <div className="flex flex-col flex-1 ">
        <Header />

        <main className=" bg-gray-50 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}