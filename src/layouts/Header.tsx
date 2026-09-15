// import React from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

function Header({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
}) {
  const { user, logout } = useAdminAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <span
        className={`text-sm text-gray-500  ${isSidebarOpen ? "ml-64" : "ml-9"}`}
      >
        {user?.nama}
      </span>
      <button
        onClick={() => void logout()}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
