"use client";

interface PengajarHeaderProps {
  pengajar: any;
}

export default function PengajarHeader({ pengajar }: PengajarHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black text-left">
        Halo, {pengajar.nama_lengkap.split(" ")[0]}! 👋
      </h1>
      <p className="font-normal text-sm text-black text-left">
        Manajemen Nilai Praktikum {pengajar.praktikumNama || pengajar.praktikum}
      </p>
    </div>
  );
}
