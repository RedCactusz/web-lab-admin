const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

function getHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superadmin_token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export interface MingguData {
  id: number;
  praktikum_id: number;
  minggu_ke: number;
  topik: string | null;
  tanggal: string | null;
  is_active: boolean;
  parameters: ParameterData[];
}

export interface ParameterData {
  id: number;
  praktikum_minggu_id: number;
  nama: string;
  bobot: string;
  tipe: string;
  max_nilai: number;
  urutan: number;
}

export interface JadwalData {
  id: number;
  praktikum_id: number;
  tanggal: string;
  waktu_mulai: string | null;
  waktu_selesai: string | null;
  ruangan: string | null;
  topik: string | null;
  catatan: string | null;
}

export interface MahasiswaWithPivot {
  id: number;
  nim: string;
  nama_lengkap: string;
  angkatan: number;
  pivot: {
    kelompok: number | null;
    plug: number | null;
  };
}

export interface DetailPraktikumData {
  praktikum: {
    id: number;
    kode: string;
    nama: string;
    slug: string;
    deskripsi: string;
    is_active: boolean;
  };
  mahasiswa: {
    id: number;
    nim: string;
    nama_lengkap: string;
    angkatan: number;
    pivot: {
      kelompok: number | null;
      plug: number | null;
    };
  }[];
  pengajar: any[];
  minggu: MingguData[];
  jadwal: JadwalData[];
  total_mahasiswa: number;
  total_pengajar: number;
}

export interface PreviewMinggu {
  minggu_ke: number;
  topik: string | null;
  tanggal: string | null;
  kolom_penilaian: {
    nama: string;
    bobot: number;
    tipe: string;
    max_nilai: number;
  }[];
  total_bobot: number;
  is_valid: boolean;
}

export const praktikumManagementService = {
  async getDetail(slug: string): Promise<DetailPraktikumData | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/detail`, { headers: getHeaders() });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async getMinggu(slug: string): Promise<MingguData[]> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/minggu`, { headers: getHeaders() });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },

  async generateMinggu(slug: string): Promise<MingguData[] | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/minggu/generate`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async updateMinggu(id: number, data: { topik?: string; tanggal?: string; is_active?: boolean }): Promise<MingguData | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/minggu/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async addParameter(mingguId: number, data: { nama: string; bobot: number; tipe?: string; max_nilai?: number; urutan?: number }): Promise<ParameterData | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/minggu/${mingguId}/parameter`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message || 'Gagal menambah parameter');
    }
    const json = await response.json();
    return json.data;
  },

  async updateParameter(id: number, data: { nama?: string; bobot?: number; tipe?: string; max_nilai?: number; urutan?: number }): Promise<ParameterData | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/parameter/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message || 'Gagal update parameter');
    }
    const json = await response.json();
    return json.data;
  },

  async deleteParameter(id: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/parameter/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message || 'Gagal hapus parameter');
    }
    return true;
  },

  async generatePenilaian(mingguId: number): Promise<{ created: number; updated: number; total_mahasiswa: number } | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/minggu/${mingguId}/generate`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message || 'Gagal generate penilaian');
    }
    const json = await response.json();
    return json.data;
  },

  async getPreview(slug: string): Promise<PreviewMinggu[]> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/preview`, { headers: getHeaders() });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },

  async getJadwal(slug: string): Promise<JadwalData[]> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/jadwal`, { headers: getHeaders() });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },

  async addJadwal(slug: string, data: { tanggal: string; waktu_mulai?: string; waktu_selesai?: string; ruangan?: string; topik?: string; catatan?: string }): Promise<JadwalData | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/jadwal`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async updateJadwal(id: number, data: { tanggal?: string; waktu_mulai?: string; waktu_selesai?: string; ruangan?: string; topik?: string; catatan?: string }): Promise<JadwalData | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/jadwal/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async deleteJadwal(id: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/jadwal/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.ok;
  },

  async assignMahasiswa(slug: string, mahasiswaId: number, kelompok: number, plug?: number): Promise<MahasiswaWithPivot | null> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/kelompok/assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mahasiswa_id: mahasiswaId, kelompok, plug }),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async removeMahasiswa(slug: string, mahasiswaId: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/super-admin/praktikum/${slug}/kelompok/remove`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mahasiswa_id: mahasiswaId }),
    });
    return response.ok;
  },
};
