const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';


function getHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superadmin_token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

function extractData<T>(json: unknown): T {
  if (!json || typeof json !== 'object') return json as T;
  return ((json as { data?: T }).data ?? json) as T;
}

export interface PengajarData {
  id: number;
  nama_lengkap: string;
  nip: string;
  username: string;
  password: string;
  praktikum: string;
  plug: number[];
  is_active: boolean;
}

export interface MahasiswaData {
  id: number;
  nim: string;
  nama_lengkap: string;
  angkatan: number;
  email?: string;
  password: string;
}

export interface PraktikumData {
  id: number;
  kode: string;
  nama: string;
  slug: string;
  deskripsi: string;
  is_active: boolean;
  jumlah_plug: number | null;
}

export interface InventarisData {
  id: number;
  kode_alat: string;
  nama: string;
  kategori: string;
  merk: string;
  tipe: string;
  kondisi: string;
  jumlah: number;
  lokasi: string;
  keterangan: string;
}

export interface NewsData {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
  image: string;
  slug: string;
  is_published: boolean;
}

export interface GalleryData {
  id: number;
  title: string;
  image: string;
  description: string;
  is_published: boolean;
}

export interface AgendaData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  is_published: boolean;
}

export interface PartnerData {
  id: number;
  nama: string;
  logo: string;
  website: string;
  description: string;
  is_published: boolean;
}

export interface KerjasamaData {
  id: number;
  title: string;
  content: string;
  date: string;
  partner_id: number;
  image: string;
  is_published: boolean;
}

export interface StatsData {
  pengajar: number;
  mahasiswa: number;
  inventaris_baik: number;
  inventaris_rusak: number;
  peminjaman_pending: number;
  peminjaman_approved: number;
  praktikum: number;
}

export const superAdminService = {
  pengajar: {
    async create(item: Omit<PengajarData, "id">): Promise<PengajarData | null> {
      const response = await fetch(`${API_URL}/super-admin/pengajar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<PengajarData | null>(await response.json());
    },
    async getAll(): Promise<PengajarData[]> {
      const response = await fetch(`${API_URL}/super-admin/pengajar`, {
        headers: getHeaders()
      });
      if (!response.ok) return [];
      return extractData<PengajarData[]>(await response.json());
    },
    async update(id: number, updates: Partial<PengajarData>): Promise<PengajarData | null> {
      const response = await fetch(`${API_URL}/super-admin/pengajar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<PengajarData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/pengajar/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  mahasiswa: {
    async getAll(): Promise<MahasiswaData[]> {
      const response = await fetch(`${API_URL}/super-admin/mahasiswa`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<MahasiswaData[]>(await response.json());
    },
    async create(item: Omit<MahasiswaData, "id">): Promise<MahasiswaData | null> {
      const response = await fetch(`${API_URL}/super-admin/mahasiswa`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<MahasiswaData | null>(await response.json());
    },
    async update(id: number, updates: Partial<MahasiswaData>): Promise<MahasiswaData | null> {
      const response = await fetch(`${API_URL}/super-admin/mahasiswa/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<MahasiswaData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/mahasiswa/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
    async importCsv(file: File): Promise<{ success: number; failed: number; errors: string[] } | null> {
      const token = typeof window !== 'undefined' ? localStorage.getItem('superadmin_token') : null;
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/super-admin/mahasiswa/import-csv`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!response.ok) return null;
      const json = await response.json();
      const data = extractData<{ results: { success: number; failed: number; errors: string[] } }>(json); return data.results;
    },
  },

  praktikum: {
    async getAll(): Promise<PraktikumData[]> {
      const response = await fetch(`${API_URL}/selector/praktikum`, { headers: getHeaders() });
      console.log("Fetch Praktikum Response:", response);
      if (!response.ok) return [];
      return extractData<PraktikumData[]>(await response.json());
    },
    async create(item: Omit<PraktikumData, "id">): Promise<PraktikumData | null> {
      const response = await fetch(`${API_URL}/super-admin/praktikum`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<PraktikumData | null>(await response.json());
    },
    async update(id: number, updates: Partial<PraktikumData>): Promise<PraktikumData | null> {
      const response = await fetch(`${API_URL}/super-admin/praktikum/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<PraktikumData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/praktikum/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  inventaris: {
    async getAll(): Promise<InventarisData[]> {
      const response = await fetch(`${API_URL}/super-admin/inventaris`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<InventarisData[]>(await response.json());
    },
    async create(item: Omit<InventarisData, "id">): Promise<InventarisData | null> {
      const response = await fetch(`${API_URL}/super-admin/inventaris`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<InventarisData | null>(await response.json());
    },
    async update(id: number, updates: Partial<InventarisData>): Promise<InventarisData | null> {
      const response = await fetch(`${API_URL}/super-admin/inventaris/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<InventarisData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/inventaris/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  news: {
    async getAll(): Promise<NewsData[]> {
      const response = await fetch(`${API_URL}/super-admin/news`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<NewsData[]>(await response.json());
    },
    async create(item: Omit<NewsData, "id" | "slug">): Promise<NewsData | null> {
      const response = await fetch(`${API_URL}/super-admin/news`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<NewsData | null>(await response.json());
    },
    async update(id: number, updates: Partial<NewsData>): Promise<NewsData | null> {
      const response = await fetch(`${API_URL}/super-admin/news/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<NewsData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/news/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  gallery: {
    async getAll(): Promise<GalleryData[]> {
      const response = await fetch(`${API_URL}/super-admin/gallery`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<GalleryData[]>(await response.json());
    },
    async create(item: Omit<GalleryData, "id">): Promise<GalleryData | null> {
      const response = await fetch(`${API_URL}/super-admin/gallery`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<GalleryData | null>(await response.json());
    },
    async update(id: number, updates: Partial<GalleryData>): Promise<GalleryData | null> {
      const response = await fetch(`${API_URL}/super-admin/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<GalleryData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  agenda: {
    async getAll(): Promise<AgendaData[]> {
      const response = await fetch(`${API_URL}/super-admin/agenda`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<AgendaData[]>(await response.json());
    },
    async create(item: Omit<AgendaData, "id">): Promise<AgendaData | null> {
      const response = await fetch(`${API_URL}/super-admin/agenda`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<AgendaData | null>(await response.json());
    },
    async update(id: number, updates: Partial<AgendaData>): Promise<AgendaData | null> {
      const response = await fetch(`${API_URL}/super-admin/agenda/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<AgendaData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/agenda/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  partners: {
    async getAll(): Promise<PartnerData[]> {
      const response = await fetch(`${API_URL}/super-admin/partners`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<PartnerData[]>(await response.json());
    },
    async create(item: Omit<PartnerData, "id">): Promise<PartnerData | null> {
      const response = await fetch(`${API_URL}/super-admin/partners`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<PartnerData | null>(await response.json());
    },
    async update(id: number, updates: Partial<PartnerData>): Promise<PartnerData | null> {
      const response = await fetch(`${API_URL}/super-admin/partners/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<PartnerData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/partners/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  kerjasama: {
    async getAll(): Promise<KerjasamaData[]> {
      const response = await fetch(`${API_URL}/super-admin/kerjasama`, { headers: getHeaders() });
      if (!response.ok) return [];
      return extractData<KerjasamaData[]>(await response.json());
    },
    async create(item: Omit<KerjasamaData, "id">): Promise<KerjasamaData | null> {
      const response = await fetch(`${API_URL}/super-admin/kerjasama`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (!response.ok) return null;
      return extractData<KerjasamaData | null>(await response.json());
    },
    async update(id: number, updates: Partial<KerjasamaData>): Promise<KerjasamaData | null> {
      const response = await fetch(`${API_URL}/super-admin/kerjasama/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return extractData<KerjasamaData | null>(await response.json());
    },
    async delete(id: number): Promise<boolean> {
      const response = await fetch(`${API_URL}/super-admin/kerjasama/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.ok;
    },
  },

  async getStats(): Promise<StatsData | null> {
    const response = await fetch(`${API_URL}/super-admin/stats`, { headers: getHeaders() });
    if (!response.ok) return null;
    return extractData<StatsData | null>(await response.json());
  },
};
