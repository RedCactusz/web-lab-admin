"use client";

import { useState, useEffect } from "react";
import { penilaianService, type MingguData, type MahasiswaNilai } from "@/app/services/penilaianService";
import Button from "@/app/components/buttons/Button";

interface TabInputProps {
  praktikum: string;
}

export default function TabInput({ praktikum }: TabInputProps) {
  const [mingguList, setMingguList] = useState<MingguData[]>([]);
  const [mahasiswa, setMahasiswa] = useState<MahasiswaNilai[]>([]);
  const [selectedMinggu, setSelectedMinggu] = useState<MingguData | null>(null);
  const [saving, setSaving] = useState(false);

  // Load mahasiswa data - dipanggil saat mount dan saat selectedMinggu berubah
  // Note: Pattern ini adalah standard data fetching dan tidak bisa dihindari
  const loadMahasiswa = async () => {
    try {
      const data = await penilaianService.getStudents(praktikum);
      setMahasiswa(data);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const minggu = await penilaianService.getMinggu(praktikum);
        setMingguList(minggu);
        if (minggu.length > 0) setSelectedMinggu(minggu[0]);
      } catch (err) {
        console.error("Error loading minggu:", err);
      }
    };
    loadData();
  }, [praktikum]);

  // Load mahasiswa saat selectedMinggu berubah
  useEffect(() => {
    if (selectedMinggu) {
      // Load data saat minggu berubah - standard data fetching pattern
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMahasiswa();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMinggu]);

  const handleInputChange = (mhsId: number, paramName: string, value: string | number) => {
    setMahasiswa(prev => prev.map(m => {
      if (m.id !== mhsId) return m;
      const nilaiData = m.nilai?.[0];
      const nilaiHarian: Record<string, unknown>[] = nilaiData?.nilai_harian ? [...nilaiData.nilai_harian] : [];
      const mingguIndex = (selectedMinggu?.minggu_ke ?? 1) - 1;

      if (!nilaiHarian[mingguIndex]) {
        nilaiHarian[mingguIndex] = {};
      }
      nilaiHarian[mingguIndex] = { ...nilaiHarian[mingguIndex], [paramName]: value };

      return {
        ...m,
        nilai: [{ ...(nilaiData || {}), nilai_harian: nilaiHarian }],
      };
    }));
  };

  const handleSave = async () => {
    if (!selectedMinggu) return;
    if (!confirm(`Simpan data Pekan ${selectedMinggu.minggu_ke}?`)) return;

    setSaving(true);
    try {
      const promises = mahasiswa.map(async (m) => {
        const nilaiData = m.nilai?.[0];
        const nilaiHarian = nilaiData?.nilai_harian ? [...nilaiData.nilai_harian] : [];
        const mingguIndex = selectedMinggu.minggu_ke - 1;

        if (!nilaiHarian[mingguIndex]) {
          nilaiHarian[mingguIndex] = {};
          for (const param of selectedMinggu.parameters) {
            nilaiHarian[mingguIndex][param.nama] = param.tipe === 'presensi' ? 'Alfa' : 0;
          }
        }

        return penilaianService.updateGrade(praktikum, m.nim, {
          kelompok: m.kelompok ?? undefined,
          plug: m.plug ?? undefined,
          nilai_harian: nilaiHarian,
        });
      });

      await Promise.all(promises);
      alert("✅ Berhasil! Data disimpan dan Nilai Akhir dihitung otomatis.");
      await loadMahasiswa();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("❌ Error: " + message);
    } finally {
      setSaving(false);
    }
  };

  const kelompokUnik = Array.from(new Set(mahasiswa.map(m => m.kelompok).filter(k => k != null))).sort((a, b) => a - b);

  if (!selectedMinggu) {
    return (
      <div className="text-center py-20 text-slate-300">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-bold mb-2">Belum Ada Minggu</h2>
        <p className="text-slate-200">Hubungi administrator untuk mengatur minggu penilaian.</p>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
      <div className="flex flex-wrap justify-between items-center bg-slate-800/40 p-4 rounded-3xl border border-slate-700/50 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-300 font-bold ml-1 uppercase">Pilih Pekan</label>
            <select
              value={selectedMinggu.id}
              onChange={(e) => {
                const m = mingguList.find(x => x.id === parseInt(e.target.value));
                if (m) setSelectedMinggu(m);
              }}
              className="bg-slate-900 rounded-xl px-4 py-2 border border-slate-700 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mingguList.map(m => (
                <option key={m.id} value={m.id}>Pekan {m.minggu_ke} - {m.topik || "Tanpa Topik"}</option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} variant="primary" className="px-8 py-3 rounded-2xl">
          {saving ? "💾 Memproses..." : "💾 Simpan Semua"}
        </Button>
      </div>

      {kelompokUnik.length === 0 ? (
        <div className="text-center py-20 text-slate-300 italic">Belum ada mahasiswa dalam kelompok.</div>
      ) : (
        <div className="space-y-12">
          {kelompokUnik.map(noKel => (
            <div key={noKel} className="bg-slate-800/20 border border-slate-700/30 rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-black">
                  KELOMPOK {noKel}
                </div>
                <div className="h-[1px] flex-grow bg-slate-700/50"></div>
              </div>

              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-slate-300 border-b border-slate-700">
                      <th className="p-4 sticky left-0 bg-[#0f172a] backdrop-blur-md z-10">Praktikan</th>
                      {selectedMinggu.parameters.map(p => (
                        <th key={p.nama} className="p-4 text-center">{p.nama}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {mahasiswa.filter(m => m.kelompok === noKel).map((m) => {
                      const nilaiData = m.nilai?.[0];
                      const nilaiHarian = nilaiData?.nilai_harian || [];
                      const mingguIndex = selectedMinggu.minggu_ke - 1;
                      const dataPekan = nilaiHarian[mingguIndex] || {};

                      return (
                        <tr key={m.id} className="hover:bg-blue-500/5 transition-colors">
                          <td className="p-4 sticky left-0 bg-[#0f172a] z-10 min-w-[180px]">
                            <p className="font-bold text-sm">{m.nama_lengkap}</p>
                            <p className="text-[9px] text-slate-300 font-mono">{m.nim} | NA: {nilaiData?.nilai_akhir || 0}</p>
                          </td>
                          {selectedMinggu.parameters.map(p => (
                            <td key={p.nama} className="p-2">
                              {p.tipe === 'presensi' ? (
                                <select
                                  value={String(dataPekan[p.nama] || "Alfa")}
                                  onChange={(e) => handleInputChange(m.id, p.nama, e.target.value)}
                                  className={`w-full bg-slate-800 border-none rounded-lg text-[10px] p-2 outline-none font-bold ${
                                    dataPekan[p.nama] === 'Alfa' ? 'text-red-400' : 'text-green-400'
                                  }`}
                                >
                                  <option value="Hadir">Hadir</option>
                                  <option value="Izin">Izin</option>
                                  <option value="Sakit">Sakit</option>
                                  <option value="Alfa">Alfa</option>
                                </select>
                              ) : (
                                <input
                                  type="number"
                                  min={0}
                                  max={p.max_nilai}
                                  value={Number(dataPekan[p.nama] ?? 0)}
                                  onChange={(e) => handleInputChange(m.id, p.nama, parseFloat(e.target.value) || 0)}
                                  className="w-14 bg-slate-800/40 border border-slate-700/50 rounded-lg p-2 text-center text-sm font-bold text-white focus:border-blue-500 focus:bg-slate-800 outline-none transition-all"
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
