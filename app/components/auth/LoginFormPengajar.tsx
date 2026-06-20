"use client";

import { useState, useEffect } from "react"; // 1. Tambahkan useEffect
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { praktikumService, type PraktikumData } from "@/app/services/praktikumService";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [praktikumOptions, setPraktikumOptions] = useState<PraktikumData[]>([]); // 3. State untuk menampung data DB
  const [praktikum, setPraktikum] = useState(""); // Default kosong dulu sebelum data di-load
  const [loading, setLoading] = useState(false);

  // 4. Ambil data praktikum asli dari database saat halaman dibuka
  useEffect(() => {
    const fetchPraktikum = async () => {
      try {
        const data = await praktikumService.getAll();
        setPraktikumOptions(data);
        if (data.length > 0) {
          setPraktikum(data[0].slug); // Set default value ke slug praktikum pertama
        }
      } catch (error) {
        console.error("Gagal memuat opsi praktikum:", error);
      }
    };
    fetchPraktikum();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman reload otomatis
    setLoading(true);   // Ubah tombol jadi "Memproses..."

    try {
      // Nilai 'praktikum' di sini sekarang otomatis berisi string SLUG asli (ex: "survei-terestris-i")
      const data = await authService.loginPengajar(username, password, praktikum);

      if (!data) {
        alert(`LOGIN GAGAL!\n\nUsername: ${username}\nPraktikum Slug: ${praktikum}\n\nPastikan data pengajar sudah terdaftar di database.`);
      } else {
        localStorage.setItem("user_pengajar", JSON.stringify(data));
        router.push("/admin/pengajar/penilaian");
      }
    } catch (error: any) {
      alert("Error Database: " + error.message);
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