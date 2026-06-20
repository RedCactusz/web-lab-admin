"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { praktikumManagementService, type DetailPraktikumData } from "@/app/services/praktikumManagementService";
import TabKelompok from "@/app/components/praktikum/TabKelompok";
import TabJadwal from "@/app/components/praktikum/TabJadwal";
import TabPenilaian from "@/app/components/praktikum/TabPenilaian";

type TabKey = "kelompok" | "jadwal" | "penilaian";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "kelompok", label: "Kelompok & Mahasiswa", icon: "👥" },
  { key: "jadwal", label: "Jadwal", icon: "📅" },
  { key: "penilaian", label: "Penilaian", icon: "📊" },
];

export default function PraktikumManagementPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<TabKey>("kelompok");
  const [detail, setDetail] = useState<DetailPraktikumData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [slug]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const res = await praktikumManagementService.getDetail(slug);
      setDetail(res);
    } catch (error) {
      console.error("Gagal memuat detail praktikum:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm">Memuat data praktikum...</p>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Praktikum tidak ditemukan</p>
        <button onClick={() => router.push("/super-admin/praktikum")} className="mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-semibold">
          ← Kembali ke daftar praktikum
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button onClick={() => router.push("/super-admin/praktikum")} className="text-sm text-gray-500 hover:text-indigo-600 mb-1 flex items-center gap-1">
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{detail.praktikum.nama}</h1>
          <p className="text-gray-600 text-sm">{detail.praktikum.kode} • {detail.total_mahasiswa} mahasiswa • {detail.total_pengajar} pengajar</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "kelompok" && <TabKelompok slug={slug} detail={detail} onRefresh={loadDetail} />}
          {activeTab === "jadwal" && <TabJadwal slug={slug} onRefresh={loadDetail} />}
          {activeTab === "penilaian" && <TabPenilaian slug={slug} detail={detail} onRefresh={loadDetail} />}
        </div>
      </div>
    </div>
  );
}
