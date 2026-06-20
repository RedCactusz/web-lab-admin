"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  user: any;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ user, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`sidebar-transition bg-emerald-950 border-r border-emerald-800/50 h-screen fixed top-0 z-40 text-slate-200 shadow-2xl ${
          isOpen
            ? 'w-80 left-0'
            : 'w-20 -left-full md:left-0'
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute -right-3 top-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-full w-7 h-7 flex items-center justify-center shadow-xl sidebar-transition z-50 ${
            !isOpen && 'translate-x-10 md:translate-x-0'
          }`}
        >
          <span className={`text-xs font-bold sidebar-transition ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
            {isOpen ? '◀' : '▶'}
          </span>
        </button>

        <div className="p-6 mt-4 md:mt-0">
          <div className={`flex items-center gap-3 sidebar-transition ${!isOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex-shrink-0 flex items-center justify-center font-bold text-emerald-950 shadow-inner">
              {user?.nama_lengkap?.charAt(0) || "U"}
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.nama_lengkap}</p>
                <p className="text-[10px] text-emerald-400 font-mono tracking-tighter">ID: {user?.username}</p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-emerald-900 mx-4 mb-6" />

        <div className="px-4 space-y-2">
          {isOpen && <p className="px-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Mengampu</p>}

          <div className={`flex items-center gap-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/50 hover:bg-emerald-900/50 transition-colors ${!isOpen && 'justify-center'}`}>
            <span className="text-xl">📐</span>
            {isOpen && (
              <div
              >
                <p className="text-[10px] text-emerald-400 leading-none">Praktikum</p>
                <p className="text-xs font-bold text-white">{user?.praktikum?.toUpperCase() || "-"}</p>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/50 hover:bg-emerald-900/50 transition-colors ${!isOpen && 'justify-center'}`}>
            <span className="text-xl">🔌</span>
            {isOpen && (
              <div
              >
                <p className="text-[10px] text-emerald-400 leading-none">Plug</p>
                <p className="text-sm font-black text-emerald-400 tracking-widest">
                  {user?.plug || "01"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 px-4">
          {isOpen && <p className="px-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Navigasi</p>}
          <div className="space-y-1">
              <button className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-800/30 text-slate-400 hover:text-white transition-all ${!isOpen && 'justify-center'}`}>
                  <span>🏠</span>
                  {isOpen && <span className="text-sm font-medium">Dashboard Utama</span>}
              </button>
              <button className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-800/30 text-slate-400 hover:text-white transition-all ${!isOpen && 'justify-center'}`}>
                  <span>📊</span>
                  {isOpen && <span className="text-sm font-medium">Laporan Akhir</span>}
              </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 px-4">
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20 ${!isOpen && 'justify-center'}`}
          >
            <span>🚪</span>
            {isOpen && <span className="text-sm font-bold">Keluar</span>}
          </button>
        </div>
      </div>
    </>
  );
}
