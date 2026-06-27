"use client";

import { useState, useEffect } from "react";
import { superAdminService, type MahasiswaData } from "@/app/services/superAdminService";
import { praktikumManagementService, type DetailPraktikumData } from "@/app/services/praktikumManagementService";

interface TabKelompokProps {
  slug: string;
  detail: DetailPraktikumData;
  onRefresh: () => void;
}

export default function TabKelompok({ slug, detail, onRefresh }: TabKelompokProps) {
  const [allMahasiswa, setAllMahasiswa] = useState<MahasiswaData[]>([]);
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMhs, setSelectedMhs] = useState<MahasiswaData | null>(null);
  const [kelompokInput, setKelompokInput] = useState("");
  const [plugInput, setPlugInput] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const mhsRes = await superAdminService.mahasiswa.getAll();
      setAllMahasiswa(mhsRes || []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data saat slug berubah
  useEffect(() => {
    // Load data saat praktikum berubah - standard data fetching pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
     
  }, [slug]);

  const filtered = allMahasiswa.filter(
    (m) =>
      m.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      m.nim.toLowerCase().includes(search.toLowerCase())
  );

  const getAssignedInfo = (mhsId: number) => {
    for (const dm of detail.mahasiswa || []) {
      if (dm.id === mhsId) {
        return { kelompok: dm.pivot?.kelompok, plug: dm.pivot?.plug };
      }
    }
    return null;
  };

  const openAssign = (mhs: MahasiswaData) => {
    setSelectedMhs(mhs);
    const existing = getAssignedInfo(mhs.id);
    setKelompokInput(existing?.kelompok?.toString() || "");
    setPlugInput(existing?.plug?.toString() || "");
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!selectedMhs || !kelompokInput) return;
    try {
      await praktikumManagementService.assignMahasiswa(
        slug,
        selectedMhs.id,
        parseInt(kelompokInput),
        plugInput ? parseInt(plugInput) : undefined
      );
      setShowAssignModal(false);
      setSelectedMhs(null);
      onRefresh();
    } catch (error) {
      console.error("Gagal assign mahasiswa:", error);
      alert("Gagal memasukkan mahasiswa ke kelompok");
    }
  };

  const handleRemove = async (mhsId: number) => {
    if (!confirm("Keluarkan mahasiswa ini dari praktikum?")) return;
    try {
      await praktikumManagementService.removeMahasiswa(slug, mhsId);
      onRefresh();
    } catch (error) {
      console.error("Gagal remove mahasiswa:", error);
      alert("Gagal mengeluarkan mahasiswa");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Memuat data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Daftar Mahasiswa</h2>
        <input
          type="text"
          placeholder="Cari mahasiswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold">NIM</th>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Kelompok</th>
              <th className="px-4 py-3 font-semibold">Plug</th>
              <th className="px-4 py-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                  Tidak ada data mahasiswa
                </td>
              </tr>
            ) : (
              filtered.map((mhs) => {
                const info = getAssignedInfo(mhs.id);
                return (
                  <tr key={mhs.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{mhs.nim}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{mhs.nama_lengkap}</td>
                    <td className="px-4 py-3">
                      {info?.kelompok ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Kelompok {info.kelompok}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Belum ada</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{info?.plug ?? "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openAssign(mhs)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Assign Kelompok">
                          📋
                        </button>
                        {info?.kelompok && (
                          <button onClick={() => handleRemove(mhs.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Keluarkan">
                            ❌
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAssignModal && selectedMhs && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Assign ke Kelompok</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedMhs.nama_lengkap} ({selectedMhs.nim})</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kelompok *</label>
                <input type="number" min="1" value={kelompokInput} onChange={(e) => setKelompokInput(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nomor kelompok" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Plug (opsional)</label>
                <input type="number" min="1" value={plugInput} onChange={(e) => setPlugInput(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nomor plug" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">Batal</button>
              <button onClick={handleAssign} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-900/20">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
