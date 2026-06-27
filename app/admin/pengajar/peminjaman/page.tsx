"use client";

import { useState, useEffect } from "react";
import { authService } from "@/app/services/authService";
import { peminjamanService } from "@/app/services/peminjamanService";
import type { Peminjaman, PengembalianItem, PeminjamanItem } from "@/app/types/peminjaman";
import PeminjamanCard from "./_features/PeminjamanCard";
import DetailModal from "./_features/DetailModal";
import TolakModal from "./_features/TolakModal";
import RevisiModal from "./_features/RevisiModal";
import KonfirmasiModal from "./_features/KonfirmasiModal";

type TabFilter = "semua" | "pending" | "diproses" | "selesai";

interface PengajarUser {
  nama_lengkap: string;
  nip?: string;
  praktikum?: string;
  role?: string;
}

export default function PeminjamanPage() {
  const [pengajar, setPengajar] = useState<PengajarUser | null>(null);
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>("semua");
  const [detailItem, setDetailItem] = useState<Peminjaman | null>(null);
  const [tolakItem, setTolakItem] = useState<Peminjaman | null>(null);
  const [revisiItem, setRevisiItem] = useState<Peminjaman | null>(null);
  const [konfirmasiItem, setKonfirmasiItem] = useState<Peminjaman | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      const data = authService.getPengajarFromStorage();
      if (data) {
        setPengajar(data);
        const all = await peminjamanService.getByPengajar();
        setPeminjaman(all);
      }
    };

    initializeData();
  }, []);

  const refreshData = async () => {
    const all = await peminjamanService.getByPengajar();
    setPeminjaman(all);
  };

  const handleApprove = async (id: number) => {
    await peminjamanService.approveByPengajar(id);
    refreshData();
  };

  const handleDecline = async (id: number, alasan: string) => {
    await peminjamanService.declineByPengajar(id, alasan);
    setTolakItem(null);
    refreshData();
  };

  const handleRevisi = async (id: number, revisedItems: PeminjamanItem[], catatan: string) => {
    await peminjamanService.revisiByPengajar(id, revisedItems, catatan);
    setRevisiItem(null);
    refreshData();
  };

  const handleKonfirmasi = async (id: number, items: PengembalianItem[], catatan: string) => {
    await peminjamanService.konfirmasiPengembalianByPengajar(id, items, catatan);
    setKonfirmasiItem(null);
    refreshData();
  };

  const filteredData = peminjaman.filter((p) => {
    if (activeTab === "pending") return p.status === "pending";
    if (activeTab === "diproses") return p.status === "approved" || p.status === "decline";
    if (activeTab === "selesai") return p.status === "completed" || p.status === "miss";
    return true;
  });

  const counts = {
    semua: peminjaman.length,
    pending: peminjaman.filter((p) => p.status === "pending").length,
    diproses: peminjaman.filter((p) => p.status === "approved" || p.status === "decline").length,
    selesai: peminjaman.filter((p) => p.status === "completed" || p.status === "miss").length,
  };

  if (!pengajar) {
    return <div className="p-10 text-gray-500 italic">Memuat data...</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengajuan Peminjaman Alat</h1>
        <p className="text-gray-600 text-sm">
          {pengajar.praktikum === "admin" || pengajar.role === "super-admin"
            ? "Semua pengajuan peminjaman"
            : `Pengajuan untuk praktikum Anda`}
        </p>
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit shadow-sm">
        {(["semua", "pending", "diproses", "selesai"] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="capitalize">{tab}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-600 font-semibold">Tidak ada pengajuan</p>
            <p className="text-gray-400 text-sm mt-1">Belum ada peminjaman di filter ini</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <PeminjamanCard
              key={item.id}
              item={item}
              onApprove={() => handleApprove(item.id as number)}
              onDecline={() => setTolakItem(item)}
              onRevisi={() => setRevisiItem(item)}
              onDetail={() => setDetailItem(item)}
              onKonfirmasi={() => setKonfirmasiItem(item)}
            />
          ))
        )}
      </div>

      {detailItem && (
        <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}

      {tolakItem && (
        <TolakModal
          item={tolakItem}
          onClose={() => setTolakItem(null)}
          onConfirm={(alasan) => handleDecline(tolakItem.id as number, alasan)}
        />
      )}

      {revisiItem && (
        <RevisiModal
          item={revisiItem}
          onClose={() => setRevisiItem(null)}
          onConfirm={(revisedItems, catatan) => handleRevisi(revisiItem.id as number, revisedItems, catatan)}
        />
      )}

      {konfirmasiItem && (
        <KonfirmasiModal
          item={konfirmasiItem}
          onClose={() => setKonfirmasiItem(null)}
          onConfirm={(items, catatan) => handleKonfirmasi(konfirmasiItem.id as number, items, catatan)}
        />
      )}
    </div>
  );
}
