const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

export interface PengajarUser {
  id: number;
  username: string;
  nama_lengkap: string;
  praktikum: string;
  praktikumNama: string;
  plug: number[];
  role?: string;
}

export const authService = {
  loginPengajar: async (username: string, password: string, praktikumId: string | null): Promise<PengajarUser | null> => {
    try {
      const response = await fetch(`${API_URL}/login/pengajar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          praktikum_slug: praktikumId,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const result = data.data || data;
      const user = result.user || result;
      const pengajar = result.pengajar || {};
      const token = result.token || '';

      const pengajarUser: PengajarUser = {
        id: user.id || 0,
        username: user.email || username,
        nama_lengkap: pengajar.nama_lengkap || user.name || username,
        praktikum: pengajar.praktikum?.slug || praktikumId || '',
        praktikumNama: pengajar.praktikum?.nama || '',
        plug: pengajar.plug || [],
        role: user.role || 'pengajar',
      };

      if (token) {
        localStorage.setItem('pengajar_token', token);
      }

      return pengajarUser;
    } catch {
      return null;
    }
  },

  getPengajarFromStorage: (): PengajarUser | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("user_pengajar");
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("user_pengajar");
  },

  logout: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("user_pengajar");
    localStorage.removeItem("pengajar_token");
  },

  registerPengajar: async (userData: Record<string, unknown>): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/register/pengajar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
