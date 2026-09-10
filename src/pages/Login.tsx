import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { ApiError } from '@/services'

export default function Login() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [nomorInduk, setNomorInduk] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(nomorInduk, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal login.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8">
        <h1 className="text-2xl font-bold">Login Admin</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="nomor_induk" className="block text-sm font-medium text-gray-700">
              Nomor Induk (NIP/NIM)
            </label>
            <input
              id="nomor_induk"
              type="text"
              inputMode="numeric"
              value={nomorInduk}
              onChange={(e) => setNomorInduk(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
