"use client";

import { useState } from "react";
import { penilaianService, type MingguData, type MahasiswaNilai } from "@/app/services/penilaianService";

interface TabTransparansiProps {
  praktikum: string;
}

export default function TabTransparansi({ praktikum }: TabTransparansiProps) {
  const [searchNim, setSearchNim] = useState("");
  const [mahasiswa, setMahasiswa] = useState<MahasiswaNilai[]>([]);
  const [mingguList, setMingguList] = useState<MingguData[]>([]);
  const [selectedMhs, setSelectedMhs] = useState<MahasiswaNilai | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchNim.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const [mhs, minggu] = await Promise.all([
        penilaianService.getStudents(praktikum),
        penilaianService.getMinggu(praktikum),
      ]);
      setMingguList(minggu);
      const found = mhs.filter(m => m.nim.toLowerCase().includes(searchNim.toLowerCase()));
      setMahasiswa(found);
      if (found.length === 1) setSelectedMhs(found[0]);
      else setSelectedMhs(null);
    } catch (err) {
      console.error("Error searching:", err);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!selectedMhs) return;
    const headers = ["Pekan", "Topik", ...mingguList.flatMap(m => m.parameters.map(p => p.nama)), "NA"];
    const nilaiData = selectedMhs.nilai?.[0];
    const nilaiHarian = nilaiData?.nilai_harian || [];
    const rows = mingguList.map((m, i) => {
      const data = nilaiHarian[i] || {};
      return [
        `P${m.minggu_ke}`,
        m.topik || "-",
        ...m.parameters.map(p => data[p.nama] ?? 0),
        i === mingguList.length - 1 ? (nilaiData?.nilai_akhir || 0) : "",
      ];
    });
    penilaianService.exportCSV(`transparansi_${selectedMhs.nim}`, headers, rows);
  };

  return (
    <div className="text-white space-y-6">
      <div className="text-center py-8">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold mb-2">Transparansi Nilai</h2>
        <p className="text-slate-200 mb-8 max-w-md mx-auto">
          Cari NIM praktikan untuk melihat laporan nilai transparan.
        </p>
      </div>

      <div className="flex gap-3 max-w-lg mx-auto">
        <input
          type="text"
          value={searchNim}
          onChange={(e) => setSearchNim(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Masukkan NIM..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !searchNim.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-sm font-bold transition-all"
        >
          {loading ? "Mencari..." : "🔍 Cari"}
        </button>
      </div>

      {searched && mahasiswa.length === 0 && (
        <div className="text-center py-10 text-slate-300 italic">Tidak ada mahasiswa dengan NIM &quot;{searchNim}&quot;</div>
      )}

      {mahasiswa.length > 1 && (
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-sm text-slate-300 mb-2">Ditemukan {mahasiswa.length} mahasiswa. Klik untuk melihat detail:</p>
          {mahasiswa.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMhs(m)}
              className="w-full text-left bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition-all"
            >
              <p className="font-bold text-white">{m.nama_lengkap}</p>
              <p className="text-xs text-slate-400 font-mono">{m.nim} | Kelompok {m.kelompok || "-"} | NA: {m.nilai?.[0]?.nilai_akhir || 0}</p>
            </button>
          ))}
        </div>
      )}

      {selectedMhs && (
        <div className="max-w-4xl mx-auto bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">{selectedMhs.nama_lengkap}</h3>
              <p className="text-sm text-slate-300 font-mono">NIM: {selectedMhs.nim} | Kelompok: {selectedMhs.kelompok || "-"} | Plug: {selectedMhs.plug || "-"}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                📥 CSV
              </button>
              <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                🖨️ Print
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-800 text-slate-200 border-b border-slate-700">
                <tr>
                  <th className="px-3 py-3">Pekan</th>
                  <th className="px-4 py-3">Topik</th>
                  {mingguList.flatMap(m => m.parameters.map(p => (
                    <th key={`${m.id}-${p.nama}`} className="px-2 py-3 text-center border-l border-slate-700/50">{p.nama}</th>
                  )))}
                  <th className="px-4 py-3 text-center bg-blue-900/30 text-blue-300 font-bold border-l border-slate-700">Skor</th>
                </tr>
              </thead>
              <tbody>
                {mingguList.map((m, i) => {
                  const nilaiData = selectedMhs.nilai?.[0];
                  const nilaiHarian = nilaiData?.nilai_harian || [];
                  const dataPekan = nilaiHarian[i] || {};
                  const skor = penilaianService.hitungNilaiPekan(dataPekan, m.parameters);

                  return (
                    <tr key={m.id} className="bg-slate-900/50 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-3 py-3 font-semibold">P{m.minggu_ke}</td>
                      <td className="px-4 py-3 text-slate-200">{m.topik || "-"}</td>
                      {m.parameters.map(p => (
                        <td key={p.nama} className="px-2 py-3 text-center border-l border-slate-800/50">
                          {dataPekan[p.nama] ?? "-"}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center font-bold bg-blue-900/10 text-blue-300 border-l border-slate-700">
                        {skor}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-blue-900/20 border-t-2 border-blue-700">
                  <td colSpan={2 + mingguList.reduce((acc, m) => acc + m.parameters.length, 0)} className="px-4 py-4 text-right font-black text-white text-base">
                    NILAI AKHIR
                  </td>
                  <td className="px-4 py-4 text-center font-black text-blue-300 text-lg">
                    {selectedMhs.nilai?.[0]?.nilai_akhir || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-slate-800/40 rounded-xl print:hidden">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Breakdown Bobot per Pekan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mingguList.map(m => (
                <div key={m.id} className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs font-bold text-white mb-1">P{m.minggu_ke} - {m.topik || "Tanpa Topik"}</p>
                  <div className="flex flex-wrap gap-1">
                    {m.parameters.map(p => (
                      <span key={p.nama} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {p.nama}: {(parseFloat(p.bobot) * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
