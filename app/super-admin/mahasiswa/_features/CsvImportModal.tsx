"use client";

import { useState, useCallback } from "react";
import { superAdminService } from "@/app/services/superAdminService";

interface CsvImportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

interface ParsedRow {
  nama: string;
  nim: string;
}

const getAngkatanFromNim = (nim: string): number | null => {
  if (nim.length >= 5) {
    const yearPart = parseInt(nim.substring(3, 5));
    if (!isNaN(yearPart)) return 2000 + yearPart;
  }
  return null;
};

const getEmailFromNim = (nim: string): string => {
  return `${nim}@student.upnyk.ac.id`;
};

export default function CsvImportModal({ onClose, onImportComplete }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const parseCsv = (text: string): ParsedRow[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    const rows: ParsedRow[] = [];

    for (let i = 0; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      if (i === 0) {
        const first = cols[0]?.toLowerCase();
        if (["nama", "nama_lengkap", "name", "nim", "no"].includes(first)) {
          continue;
        }
      }
      if (cols.length >= 2) {
        rows.push({
          nama: cols[0] || "",
          nim: cols[1] || "",
        });
      }
    }
    return rows;
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv") && !selectedFile.name.endsWith(".txt")) {
      setError("Format file harus .csv atau .txt");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCsv(text);
      setPreview(parsed);
      if (parsed.length === 0) {
        setError("File CSV kosong atau format tidak sesuai");
      }
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const result = await superAdminService.mahasiswa.importCsv(file);
      if (result) {
        setResults(result);
        if (result.success > 0) {
          onImportComplete();
        }
      } else {
        setError("Gagal mengimpor file. Pastikan format CSV benar.");
      }
    } catch {
      setError("Terjadi kesalahan saat mengimpor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Import CSV Mahasiswa</h2>
            <p className="text-gray-500 text-xs mt-0.5">Format: nama, nim (angkatan & email otomatis)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => document.getElementById("csv-file-input")?.click()}
          >
            <input
              id="csv-file-input"
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-700 font-semibold text-sm">
              {file ? file.name : "Drag & drop file CSV atau klik untuk pilih"}
            </p>
            <p className="text-gray-400 text-xs mt-1">Format: .csv atau .txt (maks 2MB)</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-700">Preview ({preview.length} baris)</h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Angkatan & email otomatis dari NIM</span>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Nama</th>
                      <th className="px-3 py-2 text-left font-semibold">NIM</th>
                      <th className="px-3 py-2 text-center font-semibold">Angkatan</th>
                      <th className="px-3 py-2 text-left font-semibold">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {preview.slice(0, 20).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-700">{row.nama}</td>
                        <td className="px-3 py-2 font-mono text-gray-600">{row.nim}</td>
                        <td className="px-3 py-2 text-center text-gray-500">{getAngkatanFromNim(row.nim) || "-"}</td>
                        <td className="px-3 py-2 text-gray-500">{getEmailFromNim(row.nim)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 20 && (
                  <div className="bg-gray-50 text-center py-1.5 text-[10px] text-gray-400">
                    ...dan {preview.length - 20} baris lainnya
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <div className={`rounded-xl p-4 border ${results.success > 0 ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1">
                    <span className="text-emerald-600 font-bold text-lg">{results.success}</span>
                    <p className="text-emerald-500 text-xs">Berhasil</p>
                  </div>
                  <div className="flex-1">
                    <span className={`font-bold text-lg ${results.failed > 0 ? "text-red-600" : "text-gray-400"}`}>{results.failed}</span>
                    <p className="text-gray-400 text-xs">Gagal</p>
                  </div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs font-bold text-red-600 mb-1">Detail Error:</p>
                  <ul className="text-xs text-red-500 space-y-0.5">
                    {results.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              {results ? "Tutup" : "Batal"}
            </button>
            {!results && (
              <button
                onClick={handleImport}
                disabled={!file || preview.length === 0 || loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-indigo-900/20"
              >
                {loading ? "Mengimpor..." : `Import ${preview.length} Mahasiswa`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
