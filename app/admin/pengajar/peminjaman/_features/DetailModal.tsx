"use client";

import type { Peminjaman } from "@/app/types/peminjaman";
import StatusBadge from "@/app/components/ui/StatusBadge";

interface DetailModalProps {
  item: Peminjaman;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const hasRevisi = item.revised_items && item.revised_items.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Detail Peminjaman</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {item.nama_mahasiswa?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{item.nama_mahasiswa}</h3>
              <p className="text-sm font-mono text-gray-600">{item.nim}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            {hasRevisi && (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                * Direvisi
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailCard label="Keperluan" value={
              item.keperluan === "lainnya"
                ? item.alasan_lainnya || "Lainnya"
                : item.keperluan
                  ? `Praktikum ${item.keperluan.charAt(0).toUpperCase() + item.keperluan.slice(1)}`
                  : "Praktikum"
            } />
            <DetailCard label="Diajukan" value={item.tanggal_pengajuan} />
            <DetailCard label="Tanggal Pinjam" value={item.tanggal_pinjam} />
            <DetailCard label="Jam Pinjam" value={item.jam_pinjam} />
            <DetailCard label="Tanggal Kembali" value={item.tanggal_kembali} />
            <DetailCard label="Jam Kembali" value={item.jam_kembali} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alat yang Diajukan</p>
            <div className="space-y-2">
              {item.items.map((al, i) => {
                const isRejected = hasRevisi && !item.revised_items?.some((r) => r.nama_alat === al.nama_alat);
                const revised = hasRevisi ? item.revised_items?.find((r) => r.nama_alat === al.nama_alat) : null;
                const isQuantityChanged = revised && revised.jumlah !== al.jumlah;

                return (
                  <div key={i} className="space-y-1">
                    <div
                      className={`flex items-center justify-between px-4 py-2 rounded-xl border ${
                        (isRejected || isQuantityChanged)
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{al.nama_alat}</span>
                        <span className="text-sm text-gray-600">×{al.jumlah}</span>
                      </div>
                      {(isRejected || isQuantityChanged) && (
                        <span className="text-xs text-red-600 font-bold">(x) Ditolak</span>
                      )}
                    </div>
                    {isQuantityChanged && (
                      <div className="flex items-center justify-between px-4 py-2 rounded-xl border bg-emerald-50 border-emerald-200 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{al.nama_alat}</span>
                          <span className="text-sm text-gray-600">×{revised.jumlah}</span>
                        </div>
                        <span className="text-xs text-amber-600 font-bold">(*) Direvisi</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {hasRevisi &&
                item.revised_items
                  ?.filter((r) => !item.items.some((al) => al.nama_alat === r.nama_alat))
                  .map((r, i) => (
                    <div
                      key={`new-${i}`}
                      className="flex items-center justify-between px-4 py-2 rounded-xl border bg-emerald-50 border-emerald-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{r.nama_alat}</span>
                        <span className="text-sm text-gray-600">×{r.jumlah}</span>
                      </div>
                      <span className="text-xs text-amber-600 font-bold">(*) Alat baru</span>
                    </div>
                  ))}
            </div>
          </div>

          {item.revisi_catatan && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-bold text-amber-700 mb-1">Catatan Pengajar:</p>
              <p className="text-sm text-amber-800">{item.revisi_catatan}</p>
            </div>
          )}

          {item.pengembalian_items && item.pengembalian_items.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hasil Pengembalian</p>
              <div className="space-y-2">
                {item.pengembalian_items.map((pg, i) => (
                  <div key={i} className="space-y-1">
                    <div
                      className={`flex items-center justify-between px-4 py-2 rounded-xl border ${
                        pg.kondisi === "rusak"
                          ? "bg-red-50 border-red-200"
                          : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{pg.item.nama_alat}</span>
                        <span className="text-sm text-gray-600">×{pg.item.jumlah}</span>
                      </div>
                      {pg.kondisi === "baik" ? (
                        <span className="text-xs text-emerald-600 font-bold">✓ Baik</span>
                      ) : (
                        <span className="text-xs text-red-600 font-bold">✕ Rusak</span>
                      )}
                    </div>
                    {pg.kondisi === "rusak" && pg.catatan && (
                      <div className="px-4 py-2 bg-red-100 rounded-xl ml-4">
                        <p className="text-xs text-red-700">{pg.catatan}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {item.pengembalian_catatan && (
                <div className="mt-3 p-4 bg-gray-100 border border-gray-200 rounded-xl">
                  <p className="text-xs font-bold text-gray-600 mb-1">Catatan Umum Pengembalian:</p>
                  <p className="text-sm text-gray-700">{item.pengembalian_catatan}</p>
                </div>
              )}
              {item.tanggal_dikembalikan && (
                <p className="text-xs text-gray-500 mt-2">Tanggal Dikembalikan: {item.tanggal_dikembalikan}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
