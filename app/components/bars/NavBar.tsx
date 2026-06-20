"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-slate-900/80">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center font-bold text-white">
          G
        </div>
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-blue-400 transition-colors">
          S.G.G. <span className="text-white font-normal text-sm ml-1"> | Laboratorium Survei Geodesi & Geometri</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm font-bold text-white">
        {/* <Link href="/" className="hover:text-white transition-colors">Beranda</Link> */}
        <Link href="/galeri" className="hover:text-white transition-colors">Galeri</Link>
        <Link href="/struktur" className="hover:text-white transition-colors">Struktur</Link>
        <Link
          href="/pengajar"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          Masuk
        </Link>
      </div>

      {/* Mobile Menu Toggle (Simplified) */}
      <div className="md:hidden flex items-center">
        <button className="p-2 text-slate-400 hover:text-white">
          <span className="text-xl">☰</span>
        </button>
      </div>
    </nav>
  );
}
