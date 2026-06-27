"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { peminjamanService } from "@/app/services/peminjamanService";
import AuthGuard from "@/app/components/ui/AuthGuard";

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  showBadge?: boolean;
}

interface PengajarUser {
  nama_lengkap: string;
  nip?: string;
  praktikum?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Penilaian", icon: "🏠", href: "/admin/pengajar/penilaian" },
  { label: "Inventaris", icon: "📦", href: "/admin/pengajar/inventaris" },
  { label: "Peminjaman", icon: "📋", href: "/admin/pengajar/peminjaman", showBadge: true },
];

export default function PengajarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<PengajarUser | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const initializeUser = async () => {
      const data = authService.getPengajarFromStorage();
      if (data) {
        setUser(data);
        if (data.praktikum) {
          const pending = await peminjamanService.getPendingByPraktikum(data.praktikum);
          setPendingCount(pending.length);
        }
      }
    };

    initializeUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <AuthGuard storageKey="user_pengajar">
      <div className="min-h-screen bg-gray-50 flex">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        <aside
          className={`sidebar-transition bg-white border-r border-gray-200 h-screen fixed top-0 z-40 shadow-sm ${
            isOpen ? "w-64 left-0" : "w-20 -left-full lg:left-0"
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`absolute -right-3 top-6 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-full w-7 h-7 flex items-center justify-center shadow-md transition-all z-50 ${
              !isOpen && "translate-x-10 lg:translate-x-0"
            }`}
          >
            <span className={`text-xs font-bold transition-transform ${isOpen ? "rotate-0" : "rotate-180"}`}>
              ◀
            </span>
          </button>

          <div className="p-5 mt-2 lg:mt-0">
            <div className={`flex items-center gap-3 transition-all ${!isOpen && "justify-center"}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-sm">
                {user?.nama_lengkap?.charAt(0) || "G"}
              </div>
              {isOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.nama_lengkap || "User"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {user?.nip || "-"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100 mx-4 mb-4" />

          <nav className="px-3 space-y-1">
            {isOpen && (
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Menu
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
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${!isOpen && "justify-center"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {isOpen && <span>{item.label}</span>}
                  </div>
                  {isOpen && item.showBadge && pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-3">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all ${
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
          <div className="p-4">
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
    </AuthGuard>
  );
}
