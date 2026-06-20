"use client";

import { useState, useEffect } from "react";
import { peminjamanService } from "@/app/services/peminjamanService";
import type { Peminjaman, PengembalianItem } from "@/app/types/peminjaman";
import PeminjamanCard from "@/app/admin/pengajar/peminjaman/_features/PeminjamanCard";
import DetailModal from "@/app/admin/pengajar/peminjaman/_features/DetailModal";
import TolakModal from "@/app/admin/pengajar/peminjaman/_features/TolakModal";
import RevisiModal from "@/app/admin/pengajar/peminjaman/_features/RevisiModal";
import KonfirmasiModal from "@/app/admin/pengajar/peminjaman/_features/KonfirmasiModal";

type TabFilter = "semua" | "pending" | "diproses" | "selesai";

export default function KelolaPeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>("semua");
  const [detailItem, setDetailItem] = useState<Peminjaman | null>(null);
  const [tolakItem, setTolakItem] = useState<Peminjaman | null>(null);
  const [revisiItem, setRevisiItem] = useState<Peminjaman | null>(null);
  const [konfirmasiItem, setKonfirmasiItem] = useState<Peminjaman | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await peminjamanService.getAll();
    setPeminjaman(data);
  };

  const handleApprove = async (id: number) => {
    await peminjamanService.approve(id);
    loadData();
  };

  const handleDecline = async (id: number, alasan: string) => {
    await peminjamanService.decline(id, alasan);
    setTolakItem(null);
    loadData();
  };

  const handleRevisi = async (id: number, revisedItems: any[], catatan: string) => {
    await peminjamanService.revisi(id, revisedItems, catatan);
    setRevisiItem(null);
    loadData();
  };

  const handleKonfirmasi = async (id: number, items: PengembalianItem[], catatan: string) => {
    await peminjamanService.konfirmasiPengembalian(id, items, catatan);
    setKonfirmasiItem(null);
    loadData();
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

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola Peminjaman</h1>
        <p className="text-gray-600 text-sm">Semua pengajuan peminjaman alat</p>
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit shadow-sm">
        {(["semua", "pending", "diproses", "selesai"] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="capitalize">{tab}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"
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

      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
      {tolakItem && <TolakModal item={tolakItem} onClose={() => setTolakItem(null)} onConfirm={(alasan) => handleDecline(tolakItem.id as number, alasan)} />}
      {revisiItem && <RevisiModal item={revisiItem} onClose={() => setRevisiItem(null)} onConfirm={(revisedItems, catatan) => handleRevisi(revisiItem.id as number, revisedItems, catatan)} />}
      {konfirmasiItem && <KonfirmasiModal item={konfirmasiItem} onClose={() => setKonfirmasiItem(null)} onConfirm={(items, catatan) => handleKonfirmasi(konfirmasiItem.id as number, items, catatan)} />}
    </div>
  );
}
