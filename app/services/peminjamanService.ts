import type { Peminjaman, PeminjamanItem } from "@/app/types/peminjaman";

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

function getHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superadmin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

function getPengajarHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pengajar_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export const peminjamanService = {
  async getAll(): Promise<Peminjaman[]> {
    try {
      const response = await fetch(`${API_URL}/super-admin/peminjaman`, { headers: getHeaders() });
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async getByPraktikum(praktikum: string): Promise<Peminjaman[]> {
    try {
      const all = await this.getAll();
      return all.filter(
        (p) => p.keperluan === praktikum || p.keperluan === "lainnya"
      );
    } catch {
      return [];
    }
  },

  async getByPengajar(): Promise<Peminjaman[]> {
    try {
      const response = await fetch(`${API_URL}/pengajar/peminjaman`, { headers: getPengajarHeaders() });
      if (!response.ok) return [];
      const json = await response.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async getPendingByPraktikum(praktikum: string): Promise<Peminjaman[]> {
    try {
      const all = await this.getAll();
      return all.filter(
        (p) =>
          p.status === "pending" &&
          (p.keperluan === praktikum || p.keperluan === "lainnya")
      );
    } catch {
      return [];
    }
  },

  async getPendingCount(): Promise<number> {
    try {
      const all = await this.getAll();
      return all.filter((p) => p.status === "pending").length;
    } catch {
      return 0;
    }
  },

  async approve(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/super-admin/peminjaman/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'approved' }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async approveByPengajar(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/pengajar/peminjaman/${id}`, {
        method: 'PUT',
        headers: getPengajarHeaders(),
        body: JSON.stringify({ status: 'approved' }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async decline(id: number, alasan: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/super-admin/peminjaman/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'decline', revisi_catatan: alasan }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async declineByPengajar(id: number, alasan: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/pengajar/peminjaman/${id}`, {
        method: 'PUT',
        headers: getPengajarHeaders(),
        body: JSON.stringify({ status: 'decline', revisi_catatan: alasan }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async revisi(id: number, revisedItems: Peminjaman["revised_items"], catatan: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/super-admin/peminjaman/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'approved', revised_items: revisedItems, revisi_catatan: catatan }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async revisiByPengajar(id: number, revisedItems: Peminjaman["revised_items"], catatan: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/pengajar/peminjaman/${id}`, {
        method: 'PUT',
        headers: getPengajarHeaders(),
        body: JSON.stringify({ status: 'approved', revised_items: revisedItems, revisi_catatan: catatan }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async konfirmasiPengembalian(
    id: number,
    items: { item: PeminjamanItem; kondisi: "baik" | "rusak"; catatan?: string }[],
    catatanUmum: string
  ): Promise<boolean> {
    try {
      const allBaik = items.every((i) => i.kondisi === "baik");
      const response = await fetch(`${API_URL}/super-admin/peminjaman/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          status: allBaik ? 'completed' : 'miss',
          pengembalian_catatan: catatanUmum,
          pengembalian_items: items,
          tanggal_dikembalikan: new Date().toISOString().split('T')[0],
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async konfirmasiPengembalianByPengajar(
    id: number,
    items: { item: PeminjamanItem; kondisi: "baik" | "rusak"; catatan?: string }[],
    catatanUmum: string
  ): Promise<boolean> {
    try {
      const allBaik = items.every((i) => i.kondisi === "baik");
      const response = await fetch(`${API_URL}/pengajar/peminjaman/${id}`, {
        method: 'PUT',
        headers: getPengajarHeaders(),
        body: JSON.stringify({
          status: allBaik ? 'completed' : 'miss',
          pengembalian_catatan: catatanUmum,
          pengembalian_items: items,
          tanggal_dikembalikan: new Date().toISOString().split('T')[0],
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async updateStatus(id: number, status: Peminjaman["status"]): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/super-admin/peminjaman/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
