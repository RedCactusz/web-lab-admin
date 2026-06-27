"use client";
import { useState } from "react";

interface BottombarProps {
  isSidebarOpen: boolean;
}

export default function Bottombar({ isSidebarOpen }: BottombarProps) {
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <div
      className={`sidebar-transition fixed bottom-0 right-0 z-30 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.3)] ${
        isStatsOpen ? 'h-64' : 'h-12'
      } ${
        isSidebarOpen ? 'left-80' : 'left-20'
      }`}
    >
      <button onClick={() => setIsStatsOpen(!isStatsOpen)} className="w-full h-12 flex flex-col items-center justify-center">
        <div className="w-12 h-1.5 rounded-full bg-slate-300 mb-1"></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {isStatsOpen ? "Tutup Statistik" : "Buka Statistik Praktikum"}
        </span>
      </button>
    </div>
  );
}
