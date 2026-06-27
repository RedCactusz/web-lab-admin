"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  storageKey: "user_pengajar" | "user_praktikan";
  redirectTo?: string;
  children: React.ReactNode;
}

export default function AuthGuard({ storageKey, redirectTo, children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const user = localStorage.getItem(storageKey);

    if (user) {
      setIsAuthenticated(true);
      setIsReady(true);
      return;
    }

    // Tidak ada yang login, redirect ke halaman login sesuai role
    setIsReady(true);
    if (redirectTo) {
      router.replace(redirectTo);
    } else {
      router.replace(storageKey === "user_pengajar" ? "/pengajar" : "/mahasiswa");
    }
  }, [storageKey, redirectTo, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 animate-pulse">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the effect
  }

  return <>{children}</>;
}
