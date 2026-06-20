"use client";

interface InventarisHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  filterKategori: string;
  setFilterKategori: (value: string) => void;
  filterKondisi: string;
  setFilterKondisi: (value: string) => void;
  onAdd: () => void;
  total: number;
}

const KATEGORI_OPTIONS = [
  { value: "all", label: "Semua Kategori" },
  { value: "surveying", label: "Surveying" },
  { value: "aksesoris", label: "Aksesoris" },
  { value: "perlengkapan", label: "Perlengkapan" },
  { value: "lainnya", label: "Lainnya" },
];

const KONDISI_OPTIONS = [
  { value: "all", label: "Semua Kondisi" },
  { value: "baik", label: "Baik" },
  { value: "rusak_ringan", label: "Rusak Ringan" },
  { value: "rusak_berat", label: "Rusak Berat" },
  { value: "maintenance", label: "Maintenance" },
];

export default function InventarisHeader({
  search,
  setSearch,
  filterKategori,
  setFilterKategori,
  filterKondisi,
  setFilterKondisi,
  onAdd,
  total,
}: InventarisHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventaris Alat Lab</h1>
          <p className="text-gray-500 text-sm">Total {total} alat terdaftar</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          + Tambah Alat
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari alat berdasarkan nama atau kode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          {KATEGORI_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filterKondisi}
          onChange={(e) => setFilterKondisi(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          {KONDISI_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
