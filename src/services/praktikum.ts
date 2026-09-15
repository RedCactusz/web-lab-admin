import { api } from './api'

export interface Praktikum {
    id: number
    praktikum_label: string
    semester: string
    is_active: boolean
    praktikum_slug: string
}

export const praktikumService = {
    async getAll(): Promise<Praktikum[]> {
        return api<Praktikum[]>('/api/admin/praktikum')
    },
    async destroy(id: number): Promise<void> {
        await api<void>(`/api/admin/praktikum/${id}`, {
            method: 'DELETE',
        })
    },
    async create(data: Omit<Praktikum, 'id'>): Promise<Praktikum> {
        return api<Praktikum>('/api/admin/praktikum', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },
    async update(id: number, data: Omit<Praktikum, 'id'>): Promise<Praktikum> {
        return api<Praktikum>(`/api/admin/praktikum/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }
}