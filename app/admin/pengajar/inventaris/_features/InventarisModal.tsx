"use client";

import { useState, useEffect } from "react";
import { type Inventaris } from "@/app/services/inventarisService";
import ImageUploader from "./ImageUploader";

interface InventarisModalProps {
  item?: Inventaris;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const KATEGORI_OPTIONS = [
  { value: "surveying", label: "Surveying" },
  { value: "aksesoris", label: "Aksesoris" },
  { value: "perlengkapan", label: "Perlengkapan" },
  { value: "lainnya", label: "Lainnya" },
];

const KONDISI_OPTIONS = [
  { value: "baik", label: "Baik" },
  { value: "rusak_ringan", label: "Rusak Ringan" },
  { value: "rusak_berat", label: "Rusak Berat" },
  { value: "maintenance", label: "Maintenance" },
];

export default function InventarisModal({ item, onClose, onSubmit }: InventarisModalProps) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    kode_alat: "",
    nama: "",
    kategori: "surveying" as Inventaris["kategori"],
    merk: "",
    tipe: "",
    kondisi: "baik" as Inventaris["kondisi"],
    jumlah: 0,
    lokasi: "",
    keterangan: "",
    foto: [] as string[],
  });

  useEffect(() => {
    if (item) {
      setForm({
        kode_alat: item.kode_alat,
        nama: item.nama,
        kategori: item.kategori,
        merk: item.merk,
        tipe: item.tipe,
        kondisi: item.kondisi,
        jumlah: item.jumlah,
        lokasi: item.lokasi,
        keterangan: item.keterangan,
        foto: item.foto || [],
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kode_alat || !form.nama) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Alat" : "Tambah Alat Baru"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Alat *</label>
              <input
                type="text"
                value={form.kode_alat}
                onChange={(e) => setForm({ ...form, kode_alat: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="TS-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah *</label>
              <input
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={0}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Alat *</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Total Station"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value as Inventaris["kategori"] })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
              <select
                value={form.kondisi}
                onChange={(e) => setForm({ ...form, kondisi: e.target.value as Inventaris["kondisi"] })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {KONDISI_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
              <input
                type="text"
                value={form.merk}
                onChange={(e) => setForm({ ...form, merk: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Leica"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
              <input
                type="text"
                value={form.tipe}
                onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="TS06 Plus"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              type="text"
              value={form.lokasi}
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Lemari A1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
              placeholder="Catatan tambahan..."
            />
          </div>

          <ImageUploader
            namaAlat={form.nama || "Alat"}
            kodeAlat={form.kode_alat || "XXX-000"}
            existingPhotos={form.foto}
            onPhotosChange={(photos) => setForm({ ...form, foto: photos })}
          />

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
              {isEdit ? "Simpan Perubahan" : "Tambah Alat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
