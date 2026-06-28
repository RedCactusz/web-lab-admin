"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { praktikumService, type PraktikumData } from "@/app/services/praktikumService";
import { useToast } from "@/app/components/ui/Toast";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [praktikumOptions, setPraktikumOptions] = useState<PraktikumData[]>([]);
  const [praktikum, setPraktikum] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPraktikum = async () => {
      try {
        const data = await praktikumService.getAll();
        setPraktikumOptions(data);
        if (data.length > 0) {
          setPraktikum(data[0].slug);
        }
      } catch (error) {
        console.error("Gagal memuat opsi praktikum:", error);
        toast.error("Gagal memuat opsi praktikum");
      }
    };
    fetchPraktikum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.loginPengajar(username, password, praktikum);

      if (!data) {
        toast.error(`Login gagal untuk username: ${username}`);
      } else {
        localStorage.setItem("user_pengajar", JSON.stringify(data));
        toast.success("Login berhasil! Mengarahkan ke dashboard...");
        setTimeout(() => {
          router.push("/admin/pengajar/penilaian");
        }, 1000);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error Database: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-1 text-center text-gray-900">Login Pengajar</h1>
      <p className="text-gray-500 text-center mb-8 text-sm">Masuk ke sistem penilaian praktikum</p>
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Praktikum</label>
          <select
            value={praktikum}
            onChange={(e) => setPraktikum(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          >
            {/* 5. Render option secara dinamis menggunakan prak.slug */}
            {praktikumOptions.length === 0 ? (
              <option value="">Memuat praktikum...</option>
            ) : (
              praktikumOptions.map((prak) => (
                <option key={prak.id} value={prak.slug}>
                  {prak.nama}
                </option>
              ))
            )}
          </select>
        </div>
        <button
          type="button"
          onClick={() => router.push("/pengajar/register")}
          className="w-full py-2 font-normal text-black"
        >
          Daftar Akun Pengajar
        </button>
        <button
          type="submit"
          disabled={loading || praktikumOptions.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full bg-gray-300 hover:bg-gray-400 py-3 rounded-lg font-semibold text-gray-700 transition-colors"
        >
          Kembali
        </button>
      </form>
    </div>
  );
}