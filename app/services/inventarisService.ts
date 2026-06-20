const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

export interface Inventaris {
  id: number;
  kode_alat: string;
  nama: string;
  kategori: "surveying" | "aksesoris" | "perlengkapan" | "lainnya";
  merk: string;
  tipe: string;
  kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "maintenance";
  jumlah: number;
  lokasi: string;
  keterangan: string;
  foto: string[];
}

export const inventarisService = {
  async getAll(): Promise<Inventaris[]> {
    try {
      const response = await fetch(`${API_URL}/super-admin/inventaris`, {
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('superadmin_token')
            ? { 'Authorization': `Bearer ${localStorage.getItem('superadmin_token')}` }
            : {}),
        },
      });
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async getById(id: number): Promise<Inventaris | null> {
    try {
      const response = await fetch(`${API_URL}/super-admin/inventaris/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('superadmin_token')
            ? { 'Authorization': `Bearer ${localStorage.getItem('superadmin_token')}` }
            : {}),
        },
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  async create(item: Omit<Inventaris, "id">): Promise<Inventaris | null> {
    try {
      const response = await fetch(`${API_URL}/super-admin/inventaris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('superadmin_token')
            ? { 'Authorization': `Bearer ${localStorage.getItem('superadmin_token')}` }
            : {}),
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  async update(id: number, updates: Partial<Inventaris>): Promise<Inventaris | null> {
    try {
      const response = await fetch(`${API_URL}/super-admin/inventaris/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('superadmin_token')
            ? { 'Authorization': `Bearer ${localStorage.getItem('superadmin_token')}` }
            : {}),
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/super-admin/inventaris/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('superadmin_token')
            ? { 'Authorization': `Bearer ${localStorage.getItem('superadmin_token')}` }
            : {}),
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async getNextId(): Promise<number> {
    const data = await this.getAll();
    return data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
  },
};
