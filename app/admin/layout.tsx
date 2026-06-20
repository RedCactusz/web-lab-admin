"use client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-2 lg:p-6">
        {children}
      </div>
    </div>
  );
}
