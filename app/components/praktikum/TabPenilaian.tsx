"use client";

import { useState, useEffect } from "react";
import { praktikumManagementService, type MingguData, type ParameterData, type DetailPraktikumData, type PreviewMinggu } from "@/app/services/praktikumManagementService";

interface TabPenilaianProps {
  slug: string;
  detail: DetailPraktikumData;
  onRefresh: () => void;
}

export default function TabPenilaian({ slug, detail, onRefresh }: TabPenilaianProps) {
  const [mingguList, setMingguList] = useState<MingguData[]>([]);
  const [preview, setPreview] = useState<PreviewMinggu[]>([]);
  const [selectedMinggu, setSelectedMinggu] = useState<MingguData | null>(null);
  const [showAddParam, setShowAddParam] = useState(false);
  const [editingParam, setEditingParam] = useState<ParameterData | null>(null);
  const [paramForm, setParamForm] = useState({ nama: "", bobot: "", tipe: "numeric", max_nilai: "100" });
  const [generating, setGenerating] = useState(false);
  const [generatingMinggu, setGeneratingMinggu] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mingguRes, previewRes] = await Promise.all([
        praktikumManagementService.getMinggu(slug),
        praktikumManagementService.getPreview(slug),
      ]);
      setMingguList(mingguRes || []);
      setPreview(previewRes || []);
    } catch (error) {
      console.error("Gagal memuat data penilaian:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMinggu = async () => {
    if (!confirm("Generate 14 minggu untuk praktikum ini? Setiap minggu akan otomatis memiliki parameter presensi.")) return;
    setGenerating(true);
    try {
      const res = await praktikumManagementService.generateMinggu(slug);
      if (res) {
        loadData();
        onRefresh();
      }
    } catch (error) {
      console.error("Gagal generate minggu:", error);
      alert("Gagal generate minggu");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddParameter = async () => {
    if (!selectedMinggu || !paramForm.nama || !paramForm.bobot) return;
    try {
      await praktikumManagementService.addParameter(selectedMinggu.id, {
        nama: paramForm.nama,
        bobot: parseFloat(paramForm.bobot),
        tipe: paramForm.tipe,
        max_nilai: parseInt(paramForm.max_nilai) || 100,
      });
      setShowAddParam(false);
      setParamForm({ nama: "", bobot: "", tipe: "numeric", max_nilai: "100" });
      loadData();
    } catch (error: any) {
      alert(error.message || "Gagal menambah parameter");
    }
  };

  const handleUpdateParameter = async () => {
    if (!editingParam || !paramForm.nama || !paramForm.bobot) return;
    try {
      await praktikumManagementService.updateParameter(editingParam.id, {
        nama: paramForm.nama,
        bobot: parseFloat(paramForm.bobot),
        tipe: paramForm.tipe,
        max_nilai: parseInt(paramForm.max_nilai) || 100,
      });
      setEditingParam(null);
      setParamForm({ nama: "", bobot: "", tipe: "numeric", max_nilai: "100" });
      loadData();
    } catch (error: any) {
      alert(error.message || "Gagal update parameter");
    }
  };

  const handleDeleteParameter = async (param: ParameterData) => {
    if (param.nama === "presensi") {
      alert("Parameter presensi tidak dapat dihapus");
      return;
    }
    if (!confirm(`Hapus parameter "${param.nama}"?`)) return;
    try {
      await praktikumManagementService.deleteParameter(param.id);
      loadData();
    } catch (error: any) {
      alert(error.message || "Gagal hapus parameter");
    }
  };

  const handleGeneratePenilaian = async (minggu: MingguData) => {
    if (!confirm(`Generate tabel penilaian untuk Minggu ${minggu.minggu_ke}? Ini akan menyinkronisasi parameter ke semua mahasiswa.`)) return;
    setGeneratingMinggu(minggu.id);
    try {
      const res = await praktikumManagementService.generatePenilaian(minggu.id);
      if (res) {
        alert(`Berhasil! ${res.created} data baru, ${res.updated} data diperbarui dari ${res.total_mahasiswa} mahasiswa`);
        onRefresh();
      }
    } catch (error: any) {
      alert(error.message || "Gagal generate penilaian");
    } finally {
      setGeneratingMinggu(null);
    }
  };

  const openEditParam = (param: ParameterData) => {
    setEditingParam(param);
    setParamForm({
      nama: param.nama,
      bobot: param.bobot.toString(),
      tipe: param.tipe,
      max_nilai: param.max_nilai.toString(),
    });
    setShowAddParam(true);
  };

  const totalBobotMinggu = (minggu: MingguData) => {
    return minggu.parameters.reduce((sum, p) => sum + parseFloat(p.bobot), 0);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Memuat data penilaian...</div>;
  }

  if (mingguList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Minggu Penilaian</h3>
        <p className="text-gray-500 text-sm mb-6">Generate 14 minggu untuk memulai pengaturan parameter penilaian</p>
        <button
          onClick={handleGenerateMinggu}
          disabled={generating}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          {generating ? "Generating..." : "Generate 14 Minggu"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Parameter Penilaian</h2>
          <p className="text-sm text-gray-500">{mingguList.length} minggu • Klik minggu untuk edit parameter</p>
        </div>
        <button
          onClick={handleGenerateMinggu}
          disabled={generating}
          className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          {generating ? "Generating..." : "Regenerate Minggu"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {mingguList.map((minggu) => {
          const bobot = totalBobotMinggu(minggu);
          const isValid = Math.abs(bobot - 1.0) < 0.001;
          return (
            <button
              key={minggu.id}
              onClick={() => setSelectedMinggu(selectedMinggu?.id === minggu.id ? null : minggu)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selectedMinggu?.id === minggu.id
                  ? "border-indigo-600 bg-indigo-50"
                  : isValid
                  ? "border-gray-200 hover:border-indigo-300 bg-white"
                  : "border-amber-200 bg-amber-50/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">Minggu {minggu.minggu_ke}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isValid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {(bobot * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{minggu.topik || "Belum ada topik"}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {minggu.parameters.map((p) => (
                  <span key={p.id} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {p.nama}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selectedMinggu && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Parameter - Minggu {selectedMinggu.minggu_ke}</h3>
            <button
              onClick={() => {
                setEditingParam(null);
                setParamForm({ nama: "", bobot: "", tipe: "numeric", max_nilai: "100" });
                setShowAddParam(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              + Tambah Parameter
            </button>
          </div>

          <div className="space-y-2">
            {selectedMinggu.parameters.map((param) => (
              <div key={param.id} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${param.tipe === "presensi" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {param.tipe}
                  </span>
                  <span className="font-semibold text-gray-900">{param.nama}</span>
                  <span className="text-sm text-gray-500">Max: {param.max_nilai}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-indigo-600">{(parseFloat(param.bobot) * 100).toFixed(0)}%</span>
                  <button onClick={() => openEditParam(param)} className="p-1 text-gray-400 hover:text-amber-600 transition-all">✏️</button>
                  {param.nama !== "presensi" && (
                    <button onClick={() => handleDeleteParameter(param)} className="p-1 text-gray-400 hover:text-red-600 transition-all">🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleGeneratePenilaian(selectedMinggu)}
              disabled={generatingMinggu === selectedMinggu.id}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-green-900/20"
            >
              {generatingMinggu === selectedMinggu.id ? "Generating..." : "Generate & Sync"}
            </button>
          </div>
        </div>
      )}

      {showAddParam && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingParam ? "Edit Parameter" : "Tambah Parameter"}</h3>
              <p className="text-sm text-gray-500 mt-1">Minggu {selectedMinggu?.minggu_ke}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Parameter *</label>
                <input type="text" value={paramForm.nama} onChange={(e) => setParamForm({ ...paramForm, nama: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="lapangan, kuis, tugas, laporan..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bobot (0.001 - 1) *</label>
                <input type="number" step="0.001" min="0.001" max="1" value={paramForm.bobot} onChange={(e) => setParamForm({ ...paramForm, bobot: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0.30" required />
                <p className="text-xs text-gray-400 mt-1">Total bobot minggu ini: {(totalBobotMinggu(selectedMinggu!) * 100).toFixed(0)}%</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe</label>
                  <select value={paramForm.tipe} onChange={(e) => setParamForm({ ...paramForm, tipe: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="numeric">Numeric</option>
                    <option value="presensi">Presensi</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Max Nilai</label>
                  <input type="number" min="1" value={paramForm.max_nilai} onChange={(e) => setParamForm({ ...paramForm, max_nilai: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setShowAddParam(false); setEditingParam(null); setParamForm({ nama: "", bobot: "", tipe: "numeric", max_nilai: "100" }); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">Batal</button>
              <button onClick={editingParam ? handleUpdateParameter : handleAddParameter} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-900/20">{editingParam ? "Update" : "Tambah"}</button>
            </div>
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Tabel Penilaian</h3>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Minggu</th>
                  <th className="px-4 py-3 font-semibold">Kolom Penilaian</th>
                  <th className="px-4 py-3 font-semibold text-center">Total Bobot</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((p) => (
                  <tr key={p.minggu_ke} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-gray-900">Minggu {p.minggu_ke}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.kolom_penilaian.map((k) => (
                          <span key={k.nama} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {k.nama} ({(k.bobot * 100).toFixed(0)}%)
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm">{(p.total_bobot * 100).toFixed(0)}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.is_valid ? "Valid" : "Invalid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
