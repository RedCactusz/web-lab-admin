"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { superAdminAuthService, type SuperAdminUser } from "@/app/services/superAdminAuthService";

interface MenuItem {
  label: string;
  icon: string;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "🏠", href: "/super-admin/dashboard" },
  { label: "Kelola Pengajar", icon: "👨‍🏫", href: "/super-admin/pengajar" },
  { label: "Kelola Mahasiswa", icon: "👨‍🎓", href: "/super-admin/mahasiswa" },
  { label: "Kelola Inventaris", icon: "📦", href: "/super-admin/inventaris" },
  { label: "Kelola Peminjaman", icon: "📋", href: "/super-admin/peminjaman" },
  { label: "Kelola Praktikum", icon: "📐", href: "/super-admin/praktikum" },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<SuperAdminUser | null>(null);

  useEffect(() => {
    if (pathname === "/super-admin/login" || pathname === "/super-admin/register") {
      setUser({} as SuperAdminUser);
      return;
    }
    const data = superAdminAuthService.getFromStorage();
    if (!data) {
      window.location.href = "/super-admin/login";
    } else {
      setUser(data);
    }
  }, [pathname]);

  const handleLogout = () => {
    superAdminAuthService.logout();
    window.location.href = "/super-admin/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/super-admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`sidebar-transition bg-slate-900 border-r border-slate-800 h-screen fixed top-0 z-40 shadow-xl ${
          isOpen ? "w-64 left-0" : "w-20 -left-full lg:left-0"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute -right-3 top-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-full w-7 h-7 flex items-center justify-center shadow-md transition-all z-50 ${
            !isOpen && "translate-x-10 lg:translate-x-0"
          }`}
        >
          <span className={`text-xs font-bold transition-transform ${isOpen ? "rotate-0" : "rotate-180"}`}>
            ◀
          </span>
        </button>

        <div className="p-5 mt-2 lg:mt-0">
          <div className={`flex items-center gap-3 transition-all ${!isOpen && "justify-center"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-sm">
              SA
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-slate-800 mx-4 mb-4" />

        <nav className="px-3 space-y-1">
          {isOpen && (
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Menu Admin
            </p>
          )}
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                } ${!isOpen && "justify-center"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {isOpen && <span>{item.label}</span>}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all ${
              !isOpen && "justify-center"
            }`}
          >
            <span>🚪</span>
            {isOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${isOpen ? "lg:ml-64" : "lg:ml-20"}`}
      >
        <div className="p-6 lg:p-10">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden mb-4 p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            ☰
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}
