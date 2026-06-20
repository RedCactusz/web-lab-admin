export type StatusPeminjaman = "pending" | "decline" | "approved" | "completed" | "miss";

export interface PeminjamanItem {
  nama_alat: string;
  jumlah: number;
}

export interface PengembalianItem {
  item: PeminjamanItem;
  kondisi: "baik" | "rusak";
  catatan?: string;
}

export interface Peminjaman {
  id: string | number;
  nim: string;
  nama_mahasiswa: string;
  keperluan: string;
  alasan_lainnya?: string;
  tanggal_pengajuan: string;
  tanggal_pinjam: string;
  jam_pinjam: string;
  tanggal_kembali: string;
  jam_kembali: string;
  items: PeminjamanItem[];
  revised_items?: PeminjamanItem[];
  revisi_catatan?: string;
  status: StatusPeminjaman;
  created_at: string;
  pengembalian_catatan?: string;
  pengembalian_items?: PengembalianItem[];
  tanggal_dikembalikan?: string;
}

const STATUS_CONFIG: Record<StatusPeminjaman, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  decline: { label: "Ditolak", className: "bg-red-100 text-red-800" },
  approved: { label: "Disetujui", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Selesai", className: "bg-emerald-100 text-emerald-800" },
  miss: { label: "Miss", className: "bg-orange-100 text-orange-800" },
};

export function StatusBadge({ status }: { status: StatusPeminjaman }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
