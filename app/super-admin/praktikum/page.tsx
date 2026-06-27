"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { superAdminService, type PraktikumData } from "@/app/services/superAdminService";

export default function KelolaPraktikumPage() {
  const router = useRouter();
  const [data, setData] = useState<PraktikumData[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PraktikumData | null>(null);
  const [deleteItem, setDeleteItem] = useState<PraktikumData | null>(null);
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    slug: "",
    deskripsi: "",
    is_active: true,
    jumlah_plug: "",
  });

  const loadData = useCallback(async () => {
    try {
      const res = await superAdminService.praktikum.getAll();
      // Pastikan jika API gagal/error, state di-set ke array kosong agar tidak crash
      setData(res || []);
    } catch (error) {
      console.error("Gagal memuat data praktikum:", error);
    }
  }, []);

  // Load data saat mount
  useEffect(() => {
    // Load initial data - standard data fetching pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const filtered = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        jumlah_plug: form.jumlah_plug ? parseInt(form.jumlah_plug) : null,
      };
      if (editingItem) {
        await superAdminService.praktikum.update(editingItem.id, payload);
      } else {
        await superAdminService.praktikum.create(payload);
      }
      closeModal();
      await loadData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data praktikum.");
    }
  };

  const openEdit = (item: PraktikumData) => {
    setEditingItem(item);
    setForm({
      kode: item.kode,
      nama: item.nama,
      slug: item.slug,
      deskripsi: item.deskripsi,
      is_active: item.is_active,
      jumlah_plug: item.jumlah_plug?.toString() || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({
      kode: "",
      nama: "",
      slug: "",
      deskripsi: "",
      is_active: true,
      jumlah_plug: "",
    });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        await superAdminService.praktikum.delete(deleteItem.id);
        setDeleteItem(null);
        await loadData(); // Ambil data terbaru setelah dipastikan terhapus
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        alert("Terjadi kesalahan saat menghapus data.");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Praktikum</h1>
          <p className="text-gray-600 text-sm">Manajemen data praktikum laboratorium</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({ kode: "", nama: "", slug: "", deskripsi: "", is_active: true, jumlah_plug: "" });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          + Tambah Praktikum
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari praktikum..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Kode Praktikum</th>
                <th className="px-4 py-3 font-semibold">Nama Praktikum</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Jumlah Plug</th>
                <th className="px-4 py-3 font-semibold">Deskripsi</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 italic">
                    Belum ada data praktikum
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.kode}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.slug}</td>
                    <td className="px-4 py-3 text-gray-600">{item.jumlah_plug || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{item.deskripsi}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => router.push(`/super-admin/praktikum/${item.slug}`)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Kelola">⚙️</button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit">✏️</button>
                        <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Hapus">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Praktikum" : "Tambah Praktikum"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Praktikum *</label>
                <input type="text" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value, })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Kode praktikum" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Praktikum *</label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Survei Terestris 1" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="sutris1" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.deskripsi || ""} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={3} placeholder="Deskripsi praktikum..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Plug/Sesi</label>
                <input type="number" min="1" value={form.jumlah_plug} onChange={(e) => setForm({ ...form, jumlah_plug: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 4" />
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
                <h3 className="text-lg font-bold text-gray-900">Hapus Praktikum?</h3>
                <p className="text-gray-500 text-sm mt-1">Yakin ingin menghapus <span className="font-semibold text-gray-700">{deleteItem.nama}</span>?</p>
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
