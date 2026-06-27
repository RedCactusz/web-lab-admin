"use client";

import { useState, useEffect } from "react";
import { superAdminService, type MahasiswaData } from "@/app/services/superAdminService";
import CsvImportModal from "./_features/CsvImportModal";

export default function KelolaMahasiswaPage() {
  const [data, setData] = useState<MahasiswaData[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MahasiswaData | null>(null);
  const [deleteItem, setDeleteItem] = useState<MahasiswaData | null>(null);
  const [form, setForm] = useState({
    nim: "",
    nama_lengkap: "",
    angkatan: 0,
    password: "",
  });

  const loadData = async () => {
    const data = await superAdminService.mahasiswa.getAll();
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter(
    (d) =>
      d.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      d.nim.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await superAdminService.mahasiswa.update(editingItem.id, form);
    } else {
      await superAdminService.mahasiswa.create(form);
    }
    closeModal();
    loadData();
  };

  const openEdit = (item: MahasiswaData) => {
    setEditingItem(item);
    setForm({
      nim: item.nim,
      nama_lengkap: item.nama_lengkap,
      angkatan: item.angkatan,
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ nim: "", nama_lengkap: "", angkatan: 0, password: "" });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      await superAdminService.mahasiswa.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Mahasiswa</h1>
          <p className="text-gray-600 text-sm">Manajemen data mahasiswa laboratorium</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            📥 Import CSV
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setForm({ nim: "", nama_lengkap: "", angkatan: 0, password: "" });
              setShowModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
          >
            + Tambah Mahasiswa
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Cari mahasiswa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">NIM</th>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Angkatan</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                    Belum ada data mahasiswa
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.nim}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.nama_lengkap}</td>
                    <td className="px-4 py-3 text-gray-600">{item.angkatan}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.email || `${item.nim}@student.upnyk.ac.id`}</td>
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
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NIM *</label>
                <input type="text" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 117190045" required />
                <p className="text-[10px] text-gray-400 mt-1">Format: 117 (jurusan) + 19 (tahun) + 045 (nomor urut)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                <input type="text" value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password {!editingItem && "*"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required={!editingItem} placeholder={editingItem ? "Kosongkan jika tidak diubah" : "Default: NIM"} />
              </div>
              {form.nim && form.nim.length >= 5 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-gray-500">Auto-generated:</p>
                  <p className="text-xs text-gray-700">Angkatan: <span className="font-semibold">{2000 + parseInt(form.nim.substring(3, 5))}</span></p>
                  <p className="text-xs text-gray-700">Email: <span className="font-semibold">{form.nim}@student.upnyk.ac.id</span></p>
                </div>
              )}
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
                <h3 className="text-lg font-bold text-gray-900">Hapus Mahasiswa?</h3>
                <p className="text-gray-500 text-sm mt-1">Yakin ingin menghapus <span className="font-semibold text-gray-700">{deleteItem.nama_lengkap}</span>?</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDeleteItem(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">Batal</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showCsvModal && (
        <CsvImportModal
          onClose={() => setShowCsvModal(false)}
          onImportComplete={loadData}
        />
      )}
    </div>
  );
}
