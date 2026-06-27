"use client";

import { useEffect, useState } from "react";
import { penilaianService, type MingguData, type MahasiswaNilai } from "@/app/services/penilaianService";

interface TabRekapProps {
  praktikum: string;
}

export default function TabRekap({ praktikum }: TabRekapProps) {
  const [mingguList, setMingguList] = useState<MingguData[]>([]);
  const [mahasiswa, setMahasiswa] = useState<MahasiswaNilai[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [minggu, mhs] = await Promise.all([
          penilaianService.getMinggu(praktikum),
          penilaianService.getStudents(praktikum),
        ]);
        setMingguList(minggu);
        setMahasiswa(mhs);
      } catch (err) {
        console.error("Gagal mengambil data rekap:", err);
      }
      setLoading(false);
    };
    loadData();
  }, [praktikum]);

  const handleExport = () => {
    const headers = ["NIM", "Nama", ...mingguList.map(m => `P${m.minggu_ke}`), "NA"];
    const rows = mahasiswa.map(m => {
      const nilaiData = m.nilai?.[0];
      const nilaiHarian = nilaiData?.nilai_harian || [];
      const row: (string | number)[] = [
        m.nim,
        m.nama_lengkap,
        ...mingguList.map((minggu, i) => {
          const data = nilaiHarian[i];
          if (!data) return 0;
          return penilaianService.hitungNilaiPekan(data, minggu.parameters || []);
        }),
        nilaiData?.nilai_akhir || 0,
      ];
      return row;
    });
    penilaianService.exportCSV(`rekap_${praktikum}`, headers, rows);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-slate-200 animate-pulse">Menghubungkan ke database...</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-left">
          <h2 className="text-xl font-bold text-white">Rekapitulasi Nilai Akhir</h2>
          <p className="text-slate-200 mt-1">Data mahasiswa berdasarkan Plug yang Anda ampu</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20"
        >
          📥 Export CSV
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-2xl border border-slate-700 bg-slate-800/20">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-200 border-b border-slate-700">
            <tr>
              <th className="px-3 py-3 sticky left-0 z-20 bg-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">NIM</th>
              <th className="px-4 py-3 sticky left-[100px] z-20 bg-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.3)] min-w-[180px]">Nama Mahasiswa</th>
              {mingguList.map((m, i) => (
                <th key={i} className="px-2 py-3 text-center border-l border-slate-700/50" title={m.topik || ""}>P{m.minggu_ke}</th>
              ))}
              <th className="px-4 py-3 text-center bg-blue-900/30 text-blue-300 font-bold border-l border-slate-700 sticky right-0 z-20">NA</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.length === 0 ? (
              <tr>
                <td colSpan={mingguList.length + 3} className="text-center py-20 text-slate-300 italic">
                  Belum ada data mahasiswa untuk Plug ini di database.
                </td>
              </tr>
            ) : (
              mahasiswa.map((m, idx) => {
                const nilaiData = m.nilai?.[0];
                const nilaiHarian = nilaiData?.nilai_harian || [];
                return (
                  <tr key={idx} className="bg-slate-900/50 border-b border-slate-800 hover:bg-slate-800/50 transition-colors group">
                    <td className="px-3 py-3 font-mono text-xs sticky left-0 z-10 bg-slate-900 group-hover:bg-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                      {m.nim}
                    </td>
                    <td className="px-4 py-3 font-bold text-white sticky left-[100px] z-10 bg-slate-900 group-hover:bg-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                      {m.nama_lengkap}
                    </td>
                    {mingguList.map((minggu, i) => {
                      const data = nilaiHarian[i];
                      const skor = data ? penilaianService.hitungNilaiPekan(data, minggu.parameters) : 0;
                      return (
                        <td key={i} className="px-2 py-3 text-center border-l border-slate-800/50">
                          <span className={`text-sm ${skor < 60 ? 'text-red-400 font-bold' : 'text-slate-200 font-semibold'}`}>
                            {skor}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-black bg-blue-900/10 text-blue-300 border-l border-slate-700 sticky right-0 z-10 bg-slate-900 group-hover:bg-slate-800 text-base">
                      {nilaiData?.nilai_akhir || 0}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
