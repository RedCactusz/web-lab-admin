"use client";

import { useState } from "react";
import type { Peminjaman } from "@/app/types/peminjaman";

interface TolakModalProps {
  item: Peminjaman;
  onClose: () => void;
  onConfirm: (alasan: string) => void;
}

export default function TolakModal({ item, onClose, onConfirm }: TolakModalProps) {
  const [alasan, setAlasan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasan.trim()) return;
    onConfirm(alasan);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <span className="text-3xl">❌</span>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">Tolak Peminjaman?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Pengajuan dari <span className="font-semibold text-gray-900">{item.nama_mahasiswa}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alasan Penolakan *</label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
                placeholder="Jelaskan alasan penolakan..."
                required
              />
            </div>

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
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all"
              >
                Tolak
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
