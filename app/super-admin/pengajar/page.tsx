"use client";

import { useState, useEffect } from "react";
import { superAdminService, type PengajarData, type PraktikumData } from "@/app/services/superAdminService";

export default function KelolaPengajarPage() {
  const [data, setData] = useState<PengajarData[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PengajarData | null>(null);
  const [deleteItem, setDeleteItem] = useState<PengajarData | null>(null);
  
  // State menampung list praktikum dari DB untuk dropdown
  const [praktikumOptions, setPraktikumOptions] = useState<PraktikumData[]>([]);

  const [form, setForm] = useState({
    nama_lengkap: "",
    nip: "",
    username: "",
    password: "",
    praktikum: "",
    plug: [] as number[],
    is_active: true,
  });

  const loadData = async () => {
    try {
      const pengajarRes = await superAdminService.pengajar.getAll();
      setData(pengajarRes || []);

      const praktikumRes = await superAdminService.praktikum.getAll();
      setPraktikumOptions(praktikumRes || []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  // Load data saat mount
  useEffect(() => {
    // Load initial data - standard data fetching pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const filtered = data.filter(
    (d) =>
      d.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      d.nip.includes(search) ||
      d.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<PengajarData, "id"> = {
      nama_lengkap: form.nama_lengkap,
      nip: form.nip || "",
      username: form.username,
      password: form.password,
      praktikum: form.praktikum.trim() !== "" ? form.praktikum : "",
      plug: form.plug,
      is_active: form.is_active,
    };

    try {
      if (editingItem) {
        await superAdminService.pengajar.update(editingItem.id, payload);
      } else {
        await superAdminService.pengajar.create(payload);
      }
      closeModal();
      await loadData();
    } catch (error: unknown) {
      console.error("Gagal menyimpan data pengajar:", error);
      alert("Gagal menyimpan data pengajar");
    }
  };

  const openEdit = (item: PengajarData) => {
    setEditingItem(item);
    const praktikumOption = praktikumOptions.find(p => p.slug === item.praktikum || String(p.id) === item.praktikum);
    const selectedPraktikum = praktikumOption ? praktikumOption.slug : item.praktikum;

    setForm({
      nama_lengkap: item.nama_lengkap,
      nip: item.nip || "",
      username: item.username || "",
      password: "",
      praktikum: selectedPraktikum,
      plug: item.plug || [],
      is_active: item.is_active ?? true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ nama_lengkap: "", nip: "", username: "", password: "", praktikum: "", plug: [], is_active: true });
  };

  const handleDelete = async () => {
    if (deleteItem) {
      await superAdminService.pengajar.delete(deleteItem.id);
      setDeleteItem(null);
      await loadData();
    }
  };

  const handlePlugCheckboxChange = (plugNumber: number, isChecked: boolean) => {
    if (isChecked) {
      setForm({ ...form, plug: [...form.plug, plugNumber].sort() });
    } else {
      setForm({ ...form, plug: form.plug.filter((p) => p !== plugNumber) });
    }
  };

  const getAvailablePlugs = (praktikumSlug: string): number[] => {
    if (!praktikumSlug || typeof praktikumSlug !== 'string') return [];
    const selected = praktikumOptions.find(p => p.slug === praktikumSlug);
    if (selected && selected.jumlah_plug && selected.jumlah_plug > 0) {
      return Array.from({ length: selected.jumlah_plug }, (_, i) => i + 1);
    }
    return [];
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengajar</h1>
          <p className="text-gray-600 text-sm">Manajemen data pengajar laboratorium</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setForm({ nama_lengkap: "", nip: "", username: "", password: "", praktikum: "", plug: [], is_active: true });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg"
        >
          + Tambah Pengajar
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari pengajar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">NIP / NIM</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Praktikum</th>
                <th className="px-4 py-3 font-semibold">Plug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 italic">
                    Belum ada data pengajar
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.nama_lengkap}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{item.nip || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.username || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {(() => {
                        const pVal = item.praktikum;
                        const lookupValue = pVal;

                        const cocok = praktikumOptions.find(p =>
                          String(p.slug) === String(lookupValue) ||
                          String(p.id) === String(lookupValue)
                        );

                        return cocok ? cocok.nama : (lookupValue ? String(lookupValue) : "-");
                      })()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{(() => {
                        const p = item.plug;
                        if (!p) return "-";
                        if (Array.isArray(p)) return p.join(", ");
                        if (typeof p === 'string') {
                          try { return JSON.parse(p).join(", "); } catch { return p; }
                        }
                        return "-";
                      })()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50">✏️</button>
                        <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">🗑️</button>
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
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Pengajar" : "Tambah Pengajar"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                <input type="text" value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIP</label>
                  <input type="text" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Username (Email) *</label>
                  <input type="text" value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password {!editingItem && "*"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required={!editingItem} placeholder={editingItem ? "Kosongkan jika tidak diubah" : ""} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Praktikum *</label>
                  <select value={form.praktikum} onChange={(e) => setForm({ ...form, praktikum: e.target.value, plug: [] })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="">-- Pilih Praktikum --</option>
                    {praktikumOptions.map((prak) => (
                      <option key={prak.id} value={prak.slug}>{prak.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Plug (Kelompok)</label>
                  {!form.praktikum ? (
                    <div className="w-full px-3 py-2 border border-dashed border-gray-200 bg-gray-50 rounded-xl text-xs text-gray-400 flex items-center h-[38px]">🔒 Pilih praktikum dahulu</div>
                  ) : (
                    <div className="flex flex-wrap gap-3 py-1.5 px-1">
                      {getAvailablePlugs(form.praktikum).map((plugNum) => (
                        <label key={plugNum} className="inline-flex items-center gap-1.5 cursor-pointer text-sm font-medium text-gray-700">
                          <input type="checkbox" checked={form.plug.includes(plugNum)} onChange={(e) => handlePlugCheckboxChange(plugNum, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          <span>{plugNum}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <label className="text-sm font-semibold text-gray-700">Aktif</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg">
                  {editingItem ? "Simpan" : "Tambah"}
                </button>
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
                <h3 className="text-lg font-bold text-gray-900">Hapus Pengajar?</h3>
                <p className="text-gray-500 text-sm mt-1">Yakin menghapus <span className="font-semibold text-gray-700">{deleteItem.nama_lengkap}</span>?</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDeleteItem(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}