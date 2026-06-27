"use client";
import { useLayoutEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  storageKey: "user_pengajar" | "user_praktikan";
  redirectTo?: string;
  children: React.ReactNode;
}

export default function AuthGuard({ storageKey, redirectTo, children }: AuthGuardProps) {
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  // Derived state: cek localStorage tanpa trigger re-render
  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem(storageKey);
  }, [storageKey]);

  useLayoutEffect(() => {
    // Hanya redirect jika belum ada user dan belum pernah redirect
    if (!isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        router.replace(storageKey === "user_pengajar" ? "/pengajar" : "/mahasiswa");
      }
    }
  }, [storageKey, redirectTo, router, isAuthenticated]);

  // Tampilkan loading jika belum terautentikasi (sedang redirect)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 animate-pulse">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
