"use client";

import { useState } from "react";
import Image from "next/image";
import { type Inventaris } from "@/app/services/inventarisService";

interface InventarisDetailModalProps {
  item: Inventaris;
  onClose: () => void;
  onEdit: () => void;
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

export default function InventarisDetailModal({
  item,
  onClose,
  onEdit,
}: InventarisDetailModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const hasPhotos = item.foto && item.foto.length > 0;
  const photoCount = hasPhotos ? item.foto.length : 0;

  const nextPhoto = () => {
    if (hasPhotos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photoCount);
    }
  };

  const prevPhoto = () => {
    if (hasPhotos) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photoCount) % photoCount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Detail Alat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {hasPhotos ? (
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={item.foto[currentPhotoIndex]}
                alt={item.nama}
                width={800}
                height={256}
                className="w-full h-64 object-cover"
              />

              {photoCount > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {currentPhotoIndex + 1}/{photoCount}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {item.foto.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentPhotoIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-48 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">📷</span>
              <p className="text-sm text-gray-400 italic">Foto belum dapat ditampilkan</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {item.nama?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{item.nama}</h3>
              <p className="text-sm font-mono text-gray-400">{item.kode_alat}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailCard label="Kategori" value={KATEGORI_LABELS[item.kategori]} />
            <DetailCard label="Kondisi" value={KONDISI_LABELS[item.kondisi]} badgeClass={KONDISI_STYLES[item.kondisi]} />
            <DetailCard label="Merk" value={item.merk} />
            <DetailCard label="Tipe" value={item.tipe} />
            <DetailCard label="Jumlah" value={item.jumlah.toString()} />
            <DetailCard label="Lokasi" value={item.lokasi} />
          </div>

          {item.keterangan && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Keterangan</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3">{item.keterangan}</p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Tutup
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold transition-all"
          >
            Edit Alat
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      {badgeClass ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
          {value}
        </span>
      ) : (
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      )}
    </div>
  );
}
