"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api'}/super-admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat mendaftar");
      }

      toast.success("Registrasi berhasil! Silakan hubungi Administrator untuk verifikasi akun Anda.");
      router.push("/super-admin/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Super Admin</h1>
          <p className="text-gray-500 text-sm">Silakan lengkapi data untuk mendaftar sebagai pengelola sistem</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username *</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi *</label>
              <input type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50">
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="text-center">
          <a href="/super-admin/login" className="text-sm text-indigo-600 hover:underline font-medium">
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}
