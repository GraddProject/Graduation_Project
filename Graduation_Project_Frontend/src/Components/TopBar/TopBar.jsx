import React from 'react'
import { Bell } from "lucide-react";

export const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4e6d4&color=2d4a2d&size=128`;

export default function TopBar({ title }) {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-400 rounded-full" />
          </button>
          <img src={avatar("Doctor User")} alt="Profile"
            className="w-9 h-9 rounded-xl object-cover border border-gray-200" />
        </div>
      </header>
    </>
  )
}
