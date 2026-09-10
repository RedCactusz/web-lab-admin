import { useEffect, useState } from 'react'
import { mahasiswaService, ApiError, type Mahasiswa, type MahasiswaListMeta } from '@/services'

const SEARCH_DEBOUNCE_MS = 400

export default function Students() {
  const [students, setStudents] = useState<Mahasiswa[]>([])
  const [meta, setMeta] = useState<MahasiswaListMeta | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [angkatan, setAngkatan] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      setDebouncedSearch(search)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    mahasiswaService
      .getAll({
        search: debouncedSearch || undefined,
        angkatan: angkatan ? Number(angkatan) : undefined,
        page,
      })
      .then((response) => {
        if (cancelled) return
        setStudents(response.data)
        setMeta(response.meta)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Gagal memuat data mahasiswa.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedSearch, angkatan, page])

  const hasActiveFilter = debouncedSearch || angkatan

  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Mahasiswa</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama atau NIM..."
          className="w-64 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <input
          type="number"
          value={angkatan}
          onChange={(event) => {
            setPage(1)
            setAngkatan(event.target.value)
          }}
          placeholder="Angkatan"
          className="w-32 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        {hasActiveFilter && (
          <button
            onClick={() => {
              setSearch('')
              setAngkatan('')
              setPage(1)
            }}
            className="text-sm text-gray-500 underline hover:text-gray-900"
          >
            Reset filter
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-4 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">NIM</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Angkatan</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                  {hasActiveFilter ? 'Tidak ada mahasiswa yang cocok dengan filter.' : 'Belum ada data mahasiswa.'}
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{student.nim}</td>
                  <td className="px-4 py-3 font-medium">{student.nama}</td>
                  <td className="px-4 py-3">{student.angkatan}</td>
                  <td className="px-4 py-3 text-gray-600">{student.surel ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Menampilkan {students.length} dari {meta.total} mahasiswa
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-md border px-3 py-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span>
              Halaman {meta.current_page} / {meta.last_page}
            </span>
            <button
              disabled={page >= meta.last_page || isLoading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border px-3 py-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
