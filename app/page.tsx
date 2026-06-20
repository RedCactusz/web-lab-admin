import Link from "next/link";

export default function AdminLandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 text-center">
        <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center font-bold text-white text-lg mx-auto mb-4">
          G
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Lab. Geomatika</h1>
        <p className="text-gray-500 text-sm mb-8">Panel Administrasi</p>

        <div className="space-y-3">
          <Link
            href="/pengajar"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Masuk sebagai Pengajar
          </Link>
          <Link
            href="/super-admin/login"
            className="block w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Masuk sebagai Super Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
