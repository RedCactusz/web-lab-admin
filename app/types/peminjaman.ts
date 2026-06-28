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
