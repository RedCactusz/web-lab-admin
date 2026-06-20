"use client";

import { useState } from "react";
import type { Peminjaman } from "@/app/types/peminjaman";
import { StatusBadge } from "@/app/types/peminjaman";

interface PeminjamanCardProps {
  item: Peminjaman;
  onApprove: () => void;
  onDecline: () => void;
  onRevisi: () => void;
  onDetail: () => void;
  onKonfirmasi: () => void;
}

export default function PeminjamanCard({
  item,
  onApprove,
  onDecline,
  onRevisi,
  onDetail,
  onKonfirmasi,
}: PeminjamanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isPending = item.status === "pending";
  const isApproved = item.status === "approved";
  const isSelesai = item.status === "completed" || item.status === "miss";
  const hasRevisi = item.revised_items && item.revised_items.length > 0;
  const hasPengembalian = item.pengembalian_items && item.pengembalian_items.length > 0;

  const keperluanLabel =
    item.keperluan === "lainnya"
      ? item.alasan_lainnya || "Lainnya"
      : item.keperluan
        ? `Praktikum ${item.keperluan.charAt(0).toUpperCase() + item.keperluan.slice(1)}`
        : "Praktikum";

  const statusDateLabel = (() => {
    if (isPending) return `Diajukan pada: ${item.tanggal_pengajuan}`;
    if (isApproved) return `Dipinjam pada: ${item.tanggal_pinjam}, ${item.jam_pinjam}`;
    if (isSelesai) return item.tanggal_dikembalikan
      ? `Dikembalikan pada: ${item.tanggal_dikembalikan}`
      : `Dipinjam pada: ${item.tanggal_pinjam}, ${item.jam_pinjam}`;
    return "";
  })();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
            {item.nama_mahasiswa?.charAt(0) || "?"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{item.nama_mahasiswa}</p>
            <p className="text-xs text-gray-600 font-mono">{item.nim}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{statusDateLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500 hidden sm:inline">{keperluanLabel}</span>
          <StatusBadge status={item.status} />
          {hasRevisi && (
            <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full hidden sm:inline">
              * Direvisi
            </span>
          )}
          {item.status === "miss" && (
            <span className="text-[10px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full hidden sm:inline">
              Ada kerusakan
            </span>
          )}
          <span className={`text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Keperluan</p>
              <p className="font-semibold text-gray-900">{keperluanLabel}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Pinjam</p>
              <p className="font-semibold text-gray-900">{item.tanggal_pinjam}</p>
              <p className="text-xs text-gray-600">{item.jam_pinjam}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Kembali</p>
              <p className="font-semibold text-gray-900">{item.tanggal_kembali}</p>
              <p className="text-xs text-gray-600">{item.jam_kembali}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Diajukan</p>
              <p className="font-semibold text-gray-900">{item.tanggal_pengajuan}</p>
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Alat</p>
            <div className="flex flex-wrap gap-2">
              {item.items.map((al, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                >
                  <span className="font-medium">{al.nama_alat}</span>
                  <span className="text-gray-500 ml-1">×{al.jumlah}</span>
                </span>
              ))}
            </div>
            {item.revisi_catatan && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 mb-1">Catatan Pengajar:</p>
                <p className="text-sm text-amber-800">{item.revisi_catatan}</p>
              </div>
            )}
            {hasPengembalian && item.pengembalian_catatan && (
              <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded-xl">
                <p className="text-xs font-semibold text-gray-600 mb-1">Catatan Pengembalian:</p>
                <p className="text-sm text-gray-700">{item.pengembalian_catatan}</p>
              </div>
            )}
            {hasPengembalian && item.tanggal_dikembalikan && (
              <p className="text-xs text-gray-500 mt-2">Dikembalikan: {item.tanggal_dikembalikan}</p>
            )}
          </div>

          {isPending && (
            <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap gap-2">
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                ✅ Setujui
              </button>
              <button
                onClick={onDecline}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                ❌ Tolak
              </button>
              <button
                onClick={onRevisi}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                ✏️ Revisi
              </button>
              <button
                onClick={onDetail}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
              >
                👁️ Detail
              </button>
            </div>
          )}

          {isApproved && (
            <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap gap-2">
              <button
                onClick={onKonfirmasi}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                📦 Konfirmasi Pengembalian
              </button>
              <button
                onClick={onDetail}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
              >
                👁️ Detail
              </button>
            </div>
          )}

          {isSelesai && (
            <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap gap-2">
              <button
                onClick={onDetail}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
              >
                👁️ Detail
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
