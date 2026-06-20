"use client";

import { useState } from "react";
import type { Peminjaman, PeminjamanItem, PengembalianItem } from "@/app/types/peminjaman";

interface KonfirmasiModalProps {
  item: Peminjaman;
  onClose: () => void;
  onConfirm: (items: PengembalianItem[], catatan: string) => void;
}

export default function KonfirmasiModal({ item, onClose, onConfirm }: KonfirmasiModalProps) {
  const [items, setItems] = useState<PengembalianItem[]>(
    item.items.map((al) => ({ item: al, kondisi: "baik" as const, catatan: "" }))
  );
  const [catatanUmum, setCatatanUmum] = useState("");

  const updateKondisi = (index: number, kondisi: "baik" | "rusak") => {
    const updated = [...items];
    updated[index] = { ...updated[index], kondisi };
    setItems(updated);
  };

  const updateCatatan = (index: number, catatan: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], catatan };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasRusak = items.some((i) => i.kondisi === "rusak");
    if (hasRusak) {
      const missingCatatan = items.filter((i) => i.kondisi === "rusak" && !i.catatan?.trim());
      if (missingCatatan.length > 0) {
        alert("Harap isi catatan untuk alat yang rusak");
        return;
      }
    }
    onConfirm(items, catatanUmum);
  };

  const hasRusak = items.some((i) => i.kondisi === "rusak");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Konfirmasi Pengembalian</h2>
          <p className="text-sm text-gray-600">{item.nama_mahasiswa} ({item.nim})</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cek Kondisi Alat</p>
            {items.map((itemData, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{itemData.item.nama_alat}</span>
                    <span className="text-sm text-gray-600">×{itemData.item.jumlah}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateKondisi(index, "baik")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        itemData.kondisi === "baik"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      ✓ Baik
                    </button>
                    <button
                      type="button"
                      onClick={() => updateKondisi(index, "rusak")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        itemData.kondisi === "rusak"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      ✕ Rusak
                    </button>
                  </div>
                </div>
                {itemData.kondisi === "rusak" && (
                  <input
                    type="text"
                    value={itemData.catatan || ""}
                    onChange={(e) => updateCatatan(index, e.target.value)}
                    placeholder="Deskripsi kerusakan..."
                    className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan Umum</label>
            <textarea
              value={catatanUmum}
              onChange={(e) => setCatatanUmum(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={2}
              placeholder="Catatan tambahan (opsional)..."
            />
          </div>

          {hasRusak && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-700 font-semibold">
                ⚠️ Alat yang rusak akan otomatis diperbarui kondisinya di database inventaris.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/20"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
