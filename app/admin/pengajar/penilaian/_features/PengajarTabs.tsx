"use client";

interface PengajarTabsProps {
  activeTab: number;
  setActiveTab: (id: number) => void;
}

const TABS = [
  { id: 1, label: "Rekap Nilai Akhir", icon: "📋" },
  { id: 2, label: "Input Nilai Harian", icon: "✍️" },
  { id: 3, label: "Transparansi & Ekspor", icon: "📄" },
];

export default function PengajarTabs({ activeTab, setActiveTab }: PengajarTabsProps) {
  return (
    <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "text-slate-200 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          <span>{tab.icon}</span>
          <span className="hidden md:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
