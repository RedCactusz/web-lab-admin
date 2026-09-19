import { api } from './api'

export interface SesiHariIni {
    plug: string
    jam_mulai: string
    jam_selesai: string
}

export interface JadwalHariIni {
    praktikum: string
    slug: string
    sesi: SesiHariIni[]
}

export interface DashboardStats {
    mahasiswa_total: number
    praktikum_aktif: number
    hari_ini: {
        hari: string
        jadwal: JadwalHariIni[]
    }
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await api<{ data: DashboardStats }>('/api/admin/dashboard')
        return response.data
    },
}
