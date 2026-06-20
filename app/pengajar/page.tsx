"use client";

import { Suspense } from "react";
import LoginFormPengajar from "@/app/components/auth/LoginFormPengajar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-gray-500">Loading Form...</div>}>
        <LoginFormPengajar />
      </Suspense>
    </main>
  );
}
