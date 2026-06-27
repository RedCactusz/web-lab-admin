"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { superAdminService, type PartnerData } from "@/app/services/superAdminService";

export default function KelolaPartnerPage() {
  const [data, setData] = useState<PartnerData[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PartnerData | null>(null);
  const [deleteItem, setDeleteItem] = useState<PartnerData | null>(null);
  const [form, setForm] = useState({
    nama: "",
    logo: "",
    website: "",
    description: "",
    is_published: true,
  });

  const loadData = async () => {
    const data = await superAdminService.partners.getAll();
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await superAdminService.partners.update(editingItem.id, form);
    } else {
      await superAdminService.partners.create(form);
    }
    closeModal();
    loadData();
  };

  const openEdit = (item: PartnerData) => {
    setEditingItem(item);
    setForm({
      nama: item.nama,
      logo: item.logo,
      website: item.website,
      description: item.description,
      is_published: item.is_published,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ nama: "", logo: "", website: "", description: "", is_published: true });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      await superAdminService.partners.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Partner</h1>
          <p className="text-gray-600 text-sm">Manajemen mitra kerjasama laboratorium</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({ nama: "", logo: "", website: "", description: "", is_published: true });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          + Tambah Partner
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari partner..."
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
                <th className="px-4 py-3 font-semibold">Logo</th>
                <th className="px-4 py-3 font-semibold">Nama Partner</th>
                <th className="px-4 py-3 font-semibold">Website</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 italic">Belum ada data partner</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Image src={item.logo} alt={item.nama} width={48} height={48} className="w-12 h-12 object-contain rounded-lg bg-gray-50" />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 text-gray-600">{item.website}</td>
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
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Partner" : "Tambah Partner"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Partner *</label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL Logo *</label>
                <input type="text" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={3} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <label className="text-sm font-semibold text-gray-700">Terbitkan Partner</label>
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
                <h3 className="text-lg font-bold text-gray-900">Hapus Partner?</h3>
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
