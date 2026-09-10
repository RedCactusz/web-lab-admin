import { api } from './api'

export interface Mahasiswa {
  id: number
  nama: string
  nim: number
  surel: string | null
  angkatan: number
  is_asisten: boolean
  pengampu: string | null
  pengampu_plug: string | null
  role: 'asisten' | 'mahasiswa'
}

export interface MahasiswaListParams {
  search?: string
  angkatan?: number
  role?: 'asisten' | 'mahasiswa'
  page?: number
  perPage?: number
}

export interface MahasiswaListMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ListResponse {
  data: Mahasiswa[]
  meta: MahasiswaListMeta
}

export const mahasiswaService = {
  async getAll(params: MahasiswaListParams = {}): Promise<ListResponse> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.angkatan !== undefined) query.set('angkatan', String(params.angkatan))
    if (params.role) query.set('role', params.role)
    if (params.page !== undefined) query.set('page', String(params.page))
    if (params.perPage !== undefined) query.set('per_page', String(params.perPage))

    const qs = query.toString()
    return api<ListResponse>(`/api/admin/mahasiswa${qs ? `?${qs}` : ''}`)
  },
}
