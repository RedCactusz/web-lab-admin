import { useAdminAuth } from '@/contexts/AdminAuthContext'

export default function Dashboard() {
  const { user } = useAdminAuth()

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
    </div>
  )
}
