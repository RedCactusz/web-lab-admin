const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

export interface PraktikumData {
  id: number;
  kode: string;
  nama: string;
  slug: string;
  deskripsi: string;
  is_active: boolean;
  jumlah_plug: number | null;
}

export const praktikumService = {
  async getAll(): Promise<PraktikumData[]> {
    const response = await fetch(`${API_URL}/selector/praktikum`);
    if (!response.ok) throw new Error('Failed to fetch praktikum');
    const data = await response.json();
    return data.data || data;
  },
};
