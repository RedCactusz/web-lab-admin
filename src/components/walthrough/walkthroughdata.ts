export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "welcome",
    title: "Selamat Datang di Lab SGG Admin",
    description: "Platform ini dirancang untuk mempermudah pengelolaan inventaris alat, data praktikan, hingga jadwal praktikum.",
  },
  {
    id: "mahasiswa",
    title: "Lihat Daftar Praktikan melalui Tab Mahasiswa",
    description: "Kelola kelas praktikum dan plug yang diikuti oleh praktikan, serta lihat identitas seluruh praktikan.",
    targetSelector: "#sidebar-mahasiswa",
  
  },
  {
    id: "inventaris",
    title: "Pengelolaan Inventaris Alat",
    description: "Lihat daftar semua alat praktikum, termasuk ketersediaan alat, kondisi fisik, lokasi penyimpanan, hingga status alat.",
    targetSelector: "#sidebar-inventaris",
  },
  {
    id: "riwayat",
    title: "Riwayat Alat",
    description: "Lihat riwayat peminjaman semua alat yang dimiliki oleh Laboratorium SGG, serta praktikan yang bertanggung jawab atas alat termohon.",
    targetSelector: "#sidebar-riwayat",
  },
  {
    id: "peminjaman",
    title: "Cek Permohonan Peminjaman Alat",
    description: "Lihat semua permohonan aktif dan terima atau tolak permohonan dalam sekali klik.",
    targetSelector: "#sidebar-peminjaman",
  },
  {
    id: "revisit",
    title: "Butuh Bantuan Lagi?",
    description: "Anda selalu dapat membuka kembali panduan ini kapan saja dengan menekan tombol 'Tour' di pojok kanan bawah layar.",
  },
];