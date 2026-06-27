"use client";

import { useState, useEffect } from "react";
import { praktikumManagementService, type JadwalData } from "@/app/services/praktikumManagementService";

interface TabJadwalProps {
  slug: string;
  onRefresh: () => void;
}

export default function TabJadwal({ slug, onRefresh }: TabJadwalProps) {
  const [jadwalList, setJadwalList] = useState<JadwalData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<JadwalData | null>(null);
  const [deleteItem, setDeleteItem] = useState<JadwalData | null>(null);
  const [form, setForm] = useState({
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    ruangan: "",
    topik: "",
    catatan: "",
  });

  const loadData = async () => {
    try {
      const res = await praktikumManagementService.getJadwal(slug);
      setJadwalList(res || []);
    } catch (error) {
      console.error("Gagal memuat jadwal:", error);
    }
  };

  // Load jadwal saat slug berubah
  useEffect(() => {
    // Load data saat praktikum berubah - standard data fetching pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await praktikumManagementService.updateJadwal(editingItem.id, form);
      } else {
        await praktikumManagementService.addJadwal(slug, form);
      }
      closeModal();
      loadData();
      onRefresh();
    } catch (error) {
      console.error("Gagal menyimpan jadwal:", error);
      alert("Terjadi kesalahan saat menyimpan jadwal");
    }
  };

  const openEdit = (item: JadwalData) => {
    setEditingItem(item);
    setForm({
      tanggal: item.tanggal,
      waktu_mulai: item.waktu_mulai || "",
      waktu_selesai: item.waktu_selesai || "",
      ruangan: item.ruangan || "",
      topik: item.topik || "",
      catatan: item.catatan || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ tanggal: "", waktu_mulai: "", waktu_selesai: "", ruangan: "", topik: "", catatan: "" });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        await praktikumManagementService.deleteJadwal(deleteItem.id);
        setDeleteItem(null);
        loadData();
        onRefresh();
      } catch (error) {
        console.error("Gagal menghapus jadwal:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Jadwal Praktikum</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({ tanggal: "", waktu_mulai: "", waktu_selesai: "", ruangan: "", topik: "", catatan: "" });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          + Tambah Jadwal
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 font-semibold">Waktu</th>
              <th className="px-4 py-3 font-semibold">Ruangan</th>
              <th className="px-4 py-3 font-semibold">Topik</th>
              <th className="px-4 py-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jadwalList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                  Belum ada jadwal praktikum
                </td>
              </tr>
            ) : (
              jadwalList.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">{item.tanggal}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.waktu_mulai && item.waktu_selesai ? `${item.waktu_mulai} - ${item.waktu_selesai}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.ruangan || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.topik || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all">✏️</button>
                      <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Jadwal" : "Tambah Jadwal"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal *</label>
                <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Waktu Mulai</label>
                  <input type="time" value={form.waktu_mulai} onChange={(e) => setForm({ ...form, waktu_mulai: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Waktu Selesai</label>
                  <input type="time" value={form.waktu_selesai} onChange={(e) => setForm({ ...form, waktu_selesai: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ruangan</label>
                <input type="text" value={form.ruangan} onChange={(e) => setForm({ ...form, ruangan: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nama ruangan" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Topik</label>
                <input type="text" value={form.topik} onChange={(e) => setForm({ ...form, topik: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Topik praktikum" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan</label>
                <textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={2} placeholder="Catatan tambahan..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-900/20">{editingItem ? "Simpan" : "Tambah"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto"><span className="text-3xl">⚠️</span></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hapus Jadwal?</h3>
                <p className="text-gray-500 text-sm mt-1">Jadwal pada <span className="font-semibold text-gray-700">{deleteItem.tanggal}</span> akan dihapus</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDeleteItem(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">Batal</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
