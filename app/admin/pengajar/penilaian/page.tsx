"use client";

import { useState, useEffect } from "react";
import { authService } from "../../../services/authService";
import AuthGuard from "@/app/components/ui/AuthGuard";
import PengajarHeader from "./_features/PengajarHeader";
import PengajarTabs from "./_features/PengajarTabs";
import TabContent from "./_features/TabContent";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [pengajar, setPengajar] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = authService.getPengajarFromStorage();
    if (data) setPengajar(data);
  }, []);

  if (!mounted || !pengajar) {
    return <div className="p-10 text-slate-400 italic">Menyiapkan data...</div>;
  }

  return (
    <AuthGuard storageKey="user_pengajar">
      <div className="w-full space-y-6">
        <PengajarHeader pengajar={pengajar} />

        <PengajarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl min-h-[60vh] p-4 md:p-8 shadow-2xl backdrop-blur-sm transition-all">
          <TabContent activeTab={activeTab} praktikum={pengajar.praktikum} />
        </div>
      </div>
    </AuthGuard>
  );
}
