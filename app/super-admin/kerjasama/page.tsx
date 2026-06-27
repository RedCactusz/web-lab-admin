"use client";

import { useState, useEffect } from "react";
import { superAdminService, type KerjasamaData } from "@/app/services/superAdminService";

export default function KelolaKerjasamaPage() {
  const [data, setData] = useState<KerjasamaData[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KerjasamaData | null>(null);
  const [deleteItem, setDeleteItem] = useState<KerjasamaData | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    partner_id: 0,
    image: "",
    is_published: true,
  });

  const loadData = async () => {
    const data = await superAdminService.kerjasama.getAll();
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await superAdminService.kerjasama.update(editingItem.id, form);
    } else {
      await superAdminService.kerjasama.create(form);
    }
    closeModal();
    loadData();
  };

  const openEdit = (item: KerjasamaData) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      content: item.content,
      date: item.date,
      partner_id: item.partner_id,
      image: item.image,
      is_published: item.is_published,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
      partner_id: 0,
      image: "",
      is_published: true,
    });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      await superAdminService.kerjasama.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kerjasama</h1>
          <p className="text-gray-600 text-sm">Manajemen detail kerjasama dengan mitra</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({
              title: "",
              content: "",
              date: new Date().toISOString().split('T')[0],
              partner_id: 0,
              image: "",
              is_published: true,
            });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          + Tambah Kerjasama
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari kerjasama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400 italic">Belum ada data kerjasama</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{item.date}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>{item.is_published ? 'Published' : 'Draft'}</span>
                    </td>
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Kerjasama" : "Tambah Kerjasama"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Judul *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ID Partner *</label>
                  <input type="number" value={form.partner_id} onChange={(e) => setForm({ ...form, partner_id: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Konten *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={4} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <label className="text-sm font-semibold text-gray-700">Terbitkan Kerjasama</label>
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
                <h3 className="text-lg font-bold text-gray-900">Hapus Kerjasama?</h3>
                <p className="text-gray-500 text-sm mt-1">Yakin ingin menghapus <span className="font-semibold text-gray-700">{deleteItem.title}</span>?</p>
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
