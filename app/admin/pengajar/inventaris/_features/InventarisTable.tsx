"use client";

import { type Inventaris } from "@/app/services/inventarisService";

interface InventarisTableProps {
  data: Inventaris[];
  onEdit: (item: Inventaris) => void;
  onDelete: (item: Inventaris) => void;
  onDetail: (item: Inventaris) => void;
}

const KONDISI_STYLES: Record<string, string> = {
  baik: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rusak_ringan: "bg-amber-50 text-amber-700 border-amber-200",
  rusak_berat: "bg-red-50 text-red-700 border-red-200",
  maintenance: "bg-blue-50 text-blue-700 border-blue-200",
};

const KONDISI_LABELS: Record<string, string> = {
  baik: "Baik",
  rusak_ringan: "Rusak Ringan",
  rusak_berat: "Rusak Berat",
  maintenance: "Maintenance",
};

const KATEGORI_LABELS: Record<string, string> = {
  surveying: "Surveying",
  aksesoris: "Aksesoris",
  perlengkapan: "Perlengkapan",
  lainnya: "Lainnya",
};

export default function InventarisTable({
  data,
  onEdit,
  onDelete,
  onDetail,
}: InventarisTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Kode</th>
              <th className="px-4 py-3 font-semibold">Nama Alat</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Merk / Tipe</th>
              <th className="px-4 py-3 font-semibold">Kondisi</th>
              <th className="px-4 py-3 font-semibold text-center">Jumlah</th>
              <th className="px-4 py-3 font-semibold">Lokasi</th>
              <th className="px-4 py-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400 italic">
                  Tidak ada data alat
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.kode_alat}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{KATEGORI_LABELS[item.kategori]}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.merk} {item.tipe}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        KONDISI_STYLES[item.kondisi]
                      }`}
                    >
                      {KONDISI_LABELS[item.kondisi]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-900">
                    {item.jumlah}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.lokasi}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onDetail(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="Detail"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
