import { useEffect, useRef, useState } from 'react'
import {
  mahasiswaService,
  praktikumService,
  ApiError,
  type Mahasiswa,
  type MahasiswaListMeta,
  type MahasiswaImportResult,
  type Praktikum,
} from '@/services'

const SEARCH_DEBOUNCE_MS = 400

export default function Students() {
  const [students, setStudents] = useState<Mahasiswa[]>([])
  const [meta, setMeta] = useState<MahasiswaListMeta | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [angkatan, setAngkatan] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<MahasiswaImportResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingStudent, setEditingStudent] = useState<Mahasiswa | null>(null)
  const [praktikumOptions, setPraktikumOptions] = useState<Praktikum[]>([])
  const [editPlugs, setEditPlugs] = useState<Record<string, string>>({})
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

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
        sortDirection,
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
  }, [debouncedSearch, angkatan, page, sortDirection, refreshKey])

  const closeUploadModal = () => {
    setIsUploadOpen(false)
    setUploadFile(null)
    setUploadResult(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = () => {
    if (!uploadFile) return

    setIsUploading(true)
    setUploadError(null)

    mahasiswaService
      .importCsv(uploadFile)
      .then((result) => {
        setUploadResult(result)
        setRefreshKey((key) => key + 1)
      })
      .catch((err) => {
        setUploadError(err instanceof ApiError ? err.message : 'Gagal mengunggah file.')
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  const hasActiveFilter = debouncedSearch || angkatan

  const openEditModal = (student: Mahasiswa) => {
    setEditingStudent(student)
    setEditError(null)
    setIsLoadingOptions(true)
    setEditPlugs(
      Object.fromEntries(
        (student.praktikum ?? []).map((slug) => [slug, String(student.praktikum_plug?.[slug] ?? '')]),
      ),
    )
    praktikumService
      .getAll()
      .then((options) => setPraktikumOptions(options))
      .catch((err) => {
        setEditError(err instanceof ApiError ? err.message : 'Gagal memuat daftar praktikum.')
      })
      .finally(() => setIsLoadingOptions(false))
  }

  const closeEditModal = () => {
    setEditingStudent(null)
    setEditPlugs({})
    setEditError(null)
  }

  const togglePraktikum = (slug: string) => {
    setEditPlugs((current) => {
      if (slug in current) {
        const next = { ...current }
        delete next[slug]
        return next
      }
      return { ...current, [slug]: '' }
    })
  }

  const handleSaveEdit = () => {
    if (!editingStudent) return

    const plugs: Record<string, string> = {}
    for (const [slug, value] of Object.entries(editPlugs)) {
      const option = praktikumOptions.find((p) => p.slug === slug)
      if (!option || !option.plugs.some((jadwal) => jadwal.plug === value)) {
        setEditError('Pilih plug yang tersedia untuk setiap praktikum yang dipilih.')
        return
      }
      plugs[slug] = value
    }

    setIsSavingEdit(true)
    setEditError(null)

    mahasiswaService
      .update(editingStudent.id, {
        praktikum: Object.keys(plugs),
        praktikum_plug: plugs,
      })
      .then(() => {
        closeEditModal()
        setRefreshKey((key) => key + 1)
      })
      .catch((err) => {
        setEditError(err instanceof ApiError ? err.message : 'Gagal menyimpan perubahan.')
      })
      .finally(() => {
        setIsSavingEdit(false)
      })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Mahasiswa</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Import CSV
        </button>
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
              <th className="px-4 py-3">
                <button
                  onClick={() => {
                    setPage(1)
                    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
                  }}
                  className="flex items-center gap-1 uppercase hover:text-gray-900"
                >
                  NIM
                  <span className="text-[10px]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                </button>
              </th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Angkatan</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Praktikum</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
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
                  <td className="px-4 py-3">{student.praktikum?.length ?? 0} praktikum</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEditModal(student)}
                      className="text-sm text-gray-600 underline hover:text-gray-900"
                    >
                      Edit
                    </button>
                  </td>
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

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeUploadModal}>
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Import Mahasiswa dari CSV</h2>
            <p className="mt-2 text-sm text-gray-600">
              File CSV harus memiliki baris header dengan kolom <code className="font-mono">nama</code> dan{' '}
              <code className="font-mono">nim</code> (9 digit). Surel dan angkatan akan diisi otomatis dari NIM
              (mis. 117190045 → 117190045@student.upnyk.ac.id, angkatan 2019). Nama akan dinormalisasi menjadi huruf
              kapital di setiap kata. Data dengan NIM yang sudah ada akan diperbarui.
            </p>

            {!uploadResult ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                  className="mt-4 w-full rounded-md border px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-1.5 file:text-white"
                />
                {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeUploadModal}
                    disabled={isUploading}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || isUploading}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isUploading ? 'Mengunggah...' : 'Upload'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4 rounded-md border bg-gray-50 p-4 text-sm">
                  <p className="font-medium">{uploadResult.message}</p>
                  {uploadResult.failed.length > 0 && (
                    <ul className="mt-2 list-inside list-disc space-y-1 text-red-600">
                      {uploadResult.failed.map((item) => (
                        <li key={item.row}>
                          Baris {item.row}: {item.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closeUploadModal}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                  >
                    Selesai
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeEditModal}>
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Edit Praktikum</h2>
            <p className="mt-1 text-sm text-gray-600">
              {editingStudent.nama} ({editingStudent.nim})
            </p>

            {isLoadingOptions ? (
              <p className="mt-4 text-sm text-gray-500">Memuat daftar praktikum...</p>
            ) : praktikumOptions.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">Belum ada praktikum terdaftar.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {praktikumOptions.map((option) => {
                  const checked = option.slug in editPlugs
                  const adaJadwal = option.plugs.length > 0
                  return (
                    <li key={option.id} className="rounded-md border p-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && !adaJadwal}
                          onChange={() => togglePraktikum(option.slug)}
                        />
                        <span className="font-medium">{option.label}</span>
                        <span className="text-gray-400">({option.slug})</span>
                      </label>
                      {checked &&
                        (adaJadwal ? (
                          <div className="mt-2 flex items-center gap-2">
                            <label htmlFor={`plug-${option.id}`} className="text-sm text-gray-600">
                              Plug
                            </label>
                            <select
                              id={`plug-${option.id}`}
                              value={editPlugs[option.slug] ?? ''}
                              onChange={(event) =>
                                setEditPlugs((current) => ({
                                  ...current,
                                  [option.slug]: event.target.value,
                                }))
                              }
                              className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <option value="">Pilih plug...</option>
                              {option.plugs.map((jadwal) => (
                                <option key={jadwal.id} value={jadwal.plug}>
                                  {jadwal.plug} ({jadwal.hari} {jadwal.jam_mulai}–{jadwal.jam_selesai})
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-red-600">
                            Jadwal belum tersedia untuk praktikum ini.
                          </p>
                        ))}
                    </li>
                  )
                })}
              </ul>
            )}

            {editError && <p className="mt-3 text-sm text-red-600">{editError}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                disabled={isSavingEdit}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit || isLoadingOptions}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSavingEdit ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
