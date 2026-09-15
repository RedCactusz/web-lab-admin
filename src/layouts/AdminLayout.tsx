import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Header isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className={`flex-1 bg-gray-50 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-4 left-4 z-40 rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
            >
              ☰
            </button>
          )}
          <Outlet />
        </main>
        <Footer companyName="Lab Survei Geodesi dan Geometri - UPN Veteran Yogyakarta" />
      </div>
    </div>
  );
}
