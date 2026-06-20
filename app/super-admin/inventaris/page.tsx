"use client";

import { useState, useEffect } from "react";
import { superAdminService, type InventarisData } from "@/app/services/superAdminService";

export default function KelolaInventarisPage() {
  const [data, setData] = useState<InventarisData[]>([]);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [filterKondisi, setFilterKondisi] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventarisData | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventarisData | null>(null);
  const [form, setForm] = useState({
    kode_alat: "",
    nama: "",
    kategori: "surveying",
    merk: "",
    tipe: "",
    kondisi: "baik",
    jumlah: 0,
    lokasi: "",
    keterangan: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await superAdminService.inventaris.getAll();
    setData(data);
  };

  const filtered = data.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.kode_alat.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === "all" || item.kategori === filterKategori;
    const matchKondisi = filterKondisi === "all" || item.kondisi === filterKondisi;
    return matchSearch && matchKategori && matchKondisi;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await superAdminService.inventaris.update(editingItem.id, form);
    } else {
      await superAdminService.inventaris.create(form);
    }
    closeModal();
    loadData();
  };

  const openEdit = (item: InventarisData) => {
    setEditingItem(item);
    setForm({
      kode_alat: item.kode_alat,
      nama: item.nama,
      kategori: item.kategori,
      merk: item.merk,
      tipe: item.tipe,
      kondisi: item.kondisi,
      jumlah: item.jumlah,
      lokasi: item.lokasi,
      keterangan: item.keterangan,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ kode_alat: "", nama: "", kategori: "surveying", merk: "", tipe: "", kondisi: "baik", jumlah: 0, lokasi: "", keterangan: "" });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      await superAdminService.inventaris.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Inventaris</h1>
          <p className="text-gray-600 text-sm">Manajemen inventaris alat laboratorium</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({ kode_alat: "", nama: "", kategori: "surveying", merk: "", tipe: "", kondisi: "baik", jumlah: 0, lokasi: "", keterangan: "" });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          + Tambah Alat
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari alat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Kategori</option>
          <option value="surveying">Surveying</option>
          <option value="aksesoris">Aksesoris</option>
          <option value="perlengkapan">Perlengkapan</option>
          <option value="lainnya">Lainnya</option>
        </select>
        <select value={filterKondisi} onChange={(e) => setFilterKondisi(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Kondisi</option>
          <option value="baik">Baik</option>
          <option value="rusak_ringan">Rusak Ringan</option>
          <option value="rusak_berat">Rusak Berat</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Kode</th>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Merk/Tipe</th>
                <th className="px-4 py-3 font-semibold">Kondisi</th>
                <th className="px-4 py-3 font-semibold text-center">Jumlah</th>
                <th className="px-4 py-3 font-semibold">Lokasi</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400 italic">Belum ada data inventaris</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.kode_alat}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{item.kategori}</td>
                    <td className="px-4 py-3 text-gray-600">{item.merk} {item.tipe}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.kondisi === 'baik' ? 'bg-emerald-100 text-emerald-700' :
                        item.kondisi === 'rusak_ringan' ? 'bg-amber-100 text-amber-700' :
                        item.kondisi === 'rusak_berat' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>{item.kondisi.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">{item.jumlah}</td>
                    <td className="px-4 py-3 text-gray-600">{item.lokasi}</td>
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
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Alat" : "Tambah Alat"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Kode Alat *</label><input type="text" value={form.kode_alat} onChange={(e) => setForm({ ...form, kode_alat: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah *</label><input type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" min={0} required /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nama Alat *</label><input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label><select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="surveying">Surveying</option><option value="aksesoris">Aksesoris</option><option value="perlengkapan">Perlengkapan</option><option value="lainnya">Lainnya</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Kondisi</label><select value={form.kondisi} onChange={(e) => setForm({ ...form, kondisi: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="baik">Baik</option><option value="rusak_ringan">Rusak Ringan</option><option value="rusak_berat">Rusak Berat</option><option value="maintenance">Maintenance</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Merk</label><input type="text" value={form.merk} onChange={(e) => setForm({ ...form, merk: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Tipe</label><input type="text" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi</label><input type="text" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Keterangan</label><textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={3} /></div>
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
              <div><h3 className="text-lg font-bold text-gray-900">Hapus Alat?</h3><p className="text-gray-500 text-sm mt-1">Yakin ingin menghapus <span className="font-semibold text-gray-700">{deleteItem.nama}</span>?</p></div>
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
