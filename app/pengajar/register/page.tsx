"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { praktikumService, type PraktikumData } from "@/app/services/praktikumService";

export default function RegisterPengajarPage() {
  const router = useRouter();

  const [praktikumOptions, setPraktikumOptions] = useState<PraktikumData[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama_lengkap: "",
    username: "",
    password: "",
    praktikum: "",
    nip: "",
    plug: [] as number[],
  });

  useEffect(() => {
    const fetchPraktikum = async () => {
      try {
        const data = await praktikumService.getAll();
        setPraktikumOptions(data || []);
      } catch (error) {
        console.error("Gagal memuat opsi praktikum:", error);
      }
    };
    fetchPraktikum();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await authService.registerPengajar({
        nama_lengkap: form.nama_lengkap,
        username: form.username,
        password: form.password,
        praktikum: form.praktikum,
        nip: form.nip || null,
        plug: form.plug,
      });

      if (success) {
        alert("Pendaftaran berhasil! Silakan masuk.");
        router.push("/pengajar");
      } else {
        alert("Pendaftaran gagal. Silakan coba lagi atau hubungi administrator.");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlugCheckboxChange = (plugNumber: number, isChecked: boolean) => {
    if (isChecked) {
      setForm({ ...form, plug: [...form.plug, plugNumber].sort() });
    } else {
      setForm({ ...form, plug: form.plug.filter((p) => p !== plugNumber) });
    }
  };

  const getAvailablePlugs = (): number[] => {
    if (!form.praktikum) return [];
    const selected = praktikumOptions.find(p => p.slug === form.praktikum);
    if (selected && selected.jumlah_plug && selected.jumlah_plug > 0) {
      return Array.from({ length: selected.jumlah_plug }, (_, i) => i + 1);
    }
    return [];
  };

  const selectedPraktikum = praktikumOptions.find(p => p.slug === form.praktikum);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-1 text-center text-gray-900">Daftar Akun Pengajar</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Buat akun untuk mengakses sistem penilaian</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap *</label>
            <input
              type="text"
              placeholder="Nama lengkap"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Username / Email *</label>
            <input
              type="text"
              placeholder="username / username@email.com"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              placeholder="Buat password"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">NIP / NIM</label>
            <input
              type="text"
              placeholder="Masukkan NIP / NIM"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Praktikum *</label>
            <select
              value={form.praktikum}
              onChange={(e) => setForm({ ...form, praktikum: e.target.value, plug: [] })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            >
              <option value="">-- Pilih Praktikum --</option>
              {praktikumOptions.map((prak) => (
                <option key={prak.id} value={prak.slug}>
                  {prak.nama}
                </option>
              ))}
            </select>
          </div>

          {form.praktikum && selectedPraktikum && selectedPraktikum.jumlah_plug && selectedPraktikum.jumlah_plug > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Plug/Sesi yang Dibimbing</label>
              <div className="flex flex-wrap gap-3 py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
                {getAvailablePlugs().map((plugNum) => (
                  <label key={plugNum} className="inline-flex items-center gap-1.5 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.plug.includes(plugNum)}
                      onChange={(e) => handlePlugCheckboxChange(plugNum, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Plug {plugNum}</span>
                  </label>
                ))}
              </div>
              {form.plug.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">Pilih minimal 1 plug/sesi</p>
              )}
            </div>
          )}

          {form.praktikum && selectedPraktikum && (!selectedPraktikum.jumlah_plug || selectedPraktikum.jumlah_plug === 0) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">Jumlah plug/sesi belum diatur. Hubungi administrator.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || praktikumOptions.length === 0 || form.plug.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push("/pengajar")}
              className="text-sm text-blue-600 hover:underline"
            >
              Sudah punya akun? Masuk di sini
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
