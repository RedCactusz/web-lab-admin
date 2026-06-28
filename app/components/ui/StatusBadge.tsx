import type { StatusPeminjaman } from "@/app/types/peminjaman";

const STATUS_CONFIG: Record<StatusPeminjaman, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  decline: { label: "Ditolak", className: "bg-red-100 text-red-800" },
  approved: { label: "Disetujui", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Selesai", className: "bg-emerald-100 text-emerald-800" },
  miss: { label: "Miss", className: "bg-orange-100 text-orange-800" },
};

export default function StatusBadge({ status }: { status: StatusPeminjaman }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
