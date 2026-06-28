"use client";

import { useEffect, useState } from "react";
import { superAdminService, type StatsData } from "@/app/services/superAdminService";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    pengajar: 0,
    mahasiswa: 0,
    inventaris_baik: 0,
    inventaris_rusak: 0,
    peminjaman_pending: 0,
    peminjaman_approved: 0,
    praktikum: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await superAdminService.getStats();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Super Admin</h1>
        <p className="text-gray-600 text-sm">Ringkasan data laboratorium</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👨‍🏫"
          label="Pengajar"
          value={stats.pengajar}
          color="bg-blue-50 border-blue-200"
          iconBg="bg-blue-100"
        />
        <StatCard
          icon="👨‍🎓"
          label="Mahasiswa"
          value={stats.mahasiswa}
          color="bg-emerald-50 border-emerald-200"
          iconBg="bg-emerald-100"
        />
        <StatCard
          icon="📐"
          label="Praktikum"
          value={stats.praktikum}
          color="bg-purple-50 border-purple-200"
          iconBg="bg-purple-100"
        />
        <StatCard
          icon="📦"
          label="Inventaris"
          value={`${stats.inventaris_baik} baik / ${stats.inventaris_rusak} rusak`}
          color="bg-amber-50 border-amber-200"
          iconBg="bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon="⏳"
          label="Peminjaman Pending"
          value={stats.peminjaman_pending}
          color="bg-yellow-50 border-yellow-200"
          iconBg="bg-yellow-100"
        />
        <StatCard
          icon="✅"
          label="Peminjaman Disetujui"
          value={stats.peminjaman_approved}
          color="bg-green-50 border-green-200"
          iconBg="bg-green-100"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  iconBg,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  iconBg: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
