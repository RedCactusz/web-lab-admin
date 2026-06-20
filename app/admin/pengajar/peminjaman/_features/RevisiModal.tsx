"use client";

import { useState, useEffect, useRef } from "react";
import { inventarisService, type Inventaris } from "@/app/services/inventarisService";
import type { Peminjaman, PeminjamanItem } from "@/app/types/peminjaman";

interface RevisiModalProps {
  item: Peminjaman;
  onClose: () => void;
  onConfirm: (revisedItems: PeminjamanItem[], catatan: string) => void;
}

export default function RevisiModal({ item, onClose, onConfirm }: RevisiModalProps) {
  const [revisedItems, setRevisedItems] = useState<PeminjamanItem[]>([...item.items]);
  const [catatan, setCatatan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allAlat, setAllAlat] = useState<Inventaris[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inventarisService.getAll().then((data) => setAllAlat(data));
  }, []);

  const suggestions = searchQuery.length > 0
    ? allAlat.filter((a) =>
        a.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !revisedItems.some((r) => r.nama_alat === a.nama)
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addItem = (namaAlat: string) => {
    setRevisedItems([...revisedItems, { nama_alat: namaAlat, jumlah: 1 }]);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const removeItem = (index: number) => {
    setRevisedItems(revisedItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    const alat = allAlat.find((a) => a.nama === revisedItems[index].nama_alat);
    const maxQty = alat ? alat.jumlah : 99;
    const newQty = revisedItems[index].jumlah + delta;
    if (newQty < 1 || newQty > maxQty) return;
    const updated = [...revisedItems];
    updated[index] = { ...updated[index], jumlah: newQty };
    setRevisedItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (revisedItems.length === 0) return;
    onConfirm(revisedItems, catatan);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Revisi Peminjaman</h2>
            <p className="text-sm text-gray-600">{item.nama_mahasiswa} ({item.nim})</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div ref={searchRef} className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tambah Alat</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ketik nama alat..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => addItem(a.nama)}
                    className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-emerald-50 text-gray-700"
                  >
                    <span className="font-medium">{a.nama}</span>
                    <span className="text-xs text-gray-600">{a.jumlah} unit</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Item Revisi ({revisedItems.length})
            </p>
            {revisedItems.map((revItem, index) => {
              const originalItem = item.items.find((i) => i.nama_alat === revItem.nama_alat);
              const isChanged = !originalItem || originalItem.jumlah !== revItem.jumlah;
              const isNew = !item.items.some((i) => i.nama_alat === revItem.nama_alat);

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 border ${
                    isNew
                      ? "bg-emerald-50 border-emerald-200"
                      : isChanged
                      ? "bg-amber-50 border-amber-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{revItem.nama_alat}</p>
                      {isNew && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">BARU</span>
                      )}
                      {isChanged && !isNew && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">UBAH</span>
                      )}
                    </div>
                    {originalItem && (
                      <p className="text-xs text-gray-500">
                        Diajukan: ×{originalItem.jumlah} → Direvisi: ×{revItem.jumlah}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, -1)}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-900">{revItem.jumlah}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, 1)}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ml-2 w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan untuk Mahasiswa</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
              placeholder="Jelaskan alasan revisi..."
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold transition-all"
            >
              Kirim Revisi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
