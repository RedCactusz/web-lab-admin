const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8001/admin_api';

export interface SuperAdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: "super-admin";
}

export const superAdminAuthService = {
  login: async (username: string, password: string): Promise<{ user: SuperAdminUser; token: string } | null> => {
    try {
      const response = await fetch(`${API_URL}/super-admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const result = data.data ?? data;
      return { user: result.user, token: result.token };
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("superadmin_token");
  },

  getFromStorage: (): SuperAdminUser | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("user_superadmin");
    return data ? JSON.parse(data) : null;
  },

  saveToStorage: (user: SuperAdminUser, token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user_superadmin", JSON.stringify(user));
    localStorage.setItem("superadmin_token", token);
  },

  logout: async (): Promise<void> => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("superadmin_token");
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // tetap lanjutkan pembersihan local storage meskipun request gagal
      }
    }

    localStorage.removeItem("user_superadmin");
    localStorage.removeItem("superadmin_token");
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("superadmin_token");
  },
};
