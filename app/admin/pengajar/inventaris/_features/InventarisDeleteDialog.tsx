"use client";

import { type Inventaris } from "@/app/services/inventarisService";

interface InventarisDeleteDialogProps {
  item: Inventaris;
  onClose: () => void;
  onConfirm: () => void;
}

export default function InventarisDeleteDialog({
  item,
  onClose,
  onConfirm,
}: InventarisDeleteDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Hapus Alat?</h3>
            <p className="text-gray-500 text-sm mt-1">
              Yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-700">{item.nama}</span> ({item.kode_alat})?
              Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
