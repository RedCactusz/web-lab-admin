import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { dashboardService, ApiError, type DashboardStats } from '@/services'

export default function Dashboard() {
  const { user } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    dashboardService
      .getStats()
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Gagal memuat statistik.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          <p className="text-lg font-semibold">{user.nama}</p>
          <p className="mt-1 text-sm text-gray-600">
            {user.nip ? `NIP: ${user.nip}` : `NIM: ${user.nim}`} · Role: {user.role}
          </p>
        </div>
      )}

      {isLoading && <p className="mt-6 text-sm text-gray-500">Memuat statistik...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {stats && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm text-gray-600">Jumlah Mahasiswa</p>
            <p className="mt-2 text-3xl font-bold">{stats.mahasiswa_total}</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm text-gray-600">Praktikum Aktif</p>
            <p className="mt-2 text-3xl font-bold">{stats.praktikum_aktif}</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm text-gray-600">
              Praktikum Hari Ini{stats.hari_ini.hari ? ` · ${stats.hari_ini.hari}` : ''}
            </p>
            {stats.hari_ini.jadwal.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">Tidak ada jadwal praktikum hari ini.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {stats.hari_ini.jadwal.map((jadwal) => (
                  <li key={jadwal.slug}>
                    <p className="text-sm font-semibold">{jadwal.praktikum}</p>
                    <p className="text-xs text-gray-500">
                      {jadwal.sesi
                        .map((sesi) => `${sesi.plug} ${sesi.jam_mulai}–${sesi.jam_selesai}`)
                        .join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
