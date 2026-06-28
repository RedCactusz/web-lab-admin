const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

function getHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pengajar_token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export interface MingguData {
  id: number;
  minggu_ke: number;
  topik: string | null;
  tanggal: string | null;
  is_active: boolean;
  parameters: ParameterData[];
}

export interface ParameterData {
  id: number;
  nama: string;
  bobot: string;
  tipe: string;
  max_nilai: number;
  urutan: number;
}

export interface MahasiswaNilai {
  id: number;
  nim: string;
  nama_lengkap: string;
  kelompok: number | null;
  plug: number | null;
  nilai: Array<{
    id: number;
    nilai_harian: Record<string, unknown>[];
    nilai_akhir: string | number;
  }>;
}

const SKOR_PRESENSI: Record<string, number> = {
  "Hadir": 100,
  "Izin": 50,
  "Sakit": 50,
  "Alfa": 0,
};

export const penilaianService = {
  async getMinggu(slug: string): Promise<MingguData[]> {
    const response = await fetch(`${API_URL}/pengajar/${slug}/minggu`, { headers: getHeaders() });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },

  async getMingguParameters(slug: string, mingguId: number): Promise<MingguData | null> {
    const response = await fetch(`${API_URL}/pengajar/${slug}/minggu/${mingguId}/parameters`, { headers: getHeaders() });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async getStudents(slug: string): Promise<MahasiswaNilai[]> {
    const response = await fetch(`${API_URL}/pengajar/${slug}/students`, { headers: getHeaders() });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },

  async updateGrade(slug: string, nim: string, gradeData: {
    kelompok?: number;
    plug?: number;
    nilai_harian?: Record<string, unknown>[];
  }): Promise<unknown | null> {
    const response = await fetch(`${API_URL}/pengajar/${slug}/grades/${nim}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(gradeData),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  async getStats(slug: string): Promise<unknown | null> {
    const response = await fetch(`${API_URL}/pengajar/${slug}/stats`, { headers: getHeaders() });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  hitungNilaiPekan: (dataPekan: Record<string, unknown>, parameters: ParameterData[]): number => {
    if (!dataPekan || typeof dataPekan !== 'object' || !parameters.length) return 0;

    let total = 0;
    for (const param of parameters) {
      const nilaiParam = dataPekan[param.nama];

      if (param.tipe === 'presensi') {
        const skor = SKOR_PRESENSI[String(nilaiParam ?? '')] ?? 0;
        total += skor * parseFloat(param.bobot);
      } else {
        const nilaiNumeric = typeof nilaiParam === 'number' ? nilaiParam : (parseFloat(String(nilaiParam ?? '0')) || 0);
        const normalized = param.max_nilai > 0 ? (nilaiNumeric / param.max_nilai) * 100 : 0;
        total += normalized * parseFloat(param.bobot);
      }
    }

    return parseFloat(total.toFixed(2));
  },

  hitungNilaiAkhir: (nilaiHarian: Record<string, unknown>[], mingguList: MingguData[]): number => {
    if (!nilaiHarian?.length || !mingguList?.length) return 0;

    let totalBobot = 0;
    let totalMinggu = 0;

    for (let i = 0; i < mingguList.length; i++) {
      const minggu = mingguList[i];
      const dataMinggu = nilaiHarian[i];
      if (!dataMinggu) continue;

      const skorMinggu = penilaianService.hitungNilaiPekan(dataMinggu, minggu.parameters);
      totalBobot += skorMinggu;
      totalMinggu++;
    }

    if (totalMinggu === 0) return 0;
    return parseFloat((totalBobot / totalMinggu).toFixed(2));
  },

  exportCSV: (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },
};
