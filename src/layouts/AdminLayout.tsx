import { NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export default function AdminLayout() {
  const { user, logout } = useAdminAuth()

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r bg-gray-900 text-white">
        <div className="flex h-16 items-center px-4 text-lg font-bold">Lab SGG Admin</div>
        <nav className="flex-1 space-y-1 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/mahasiswa"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
            }
          >
            Mahasiswa
          </NavLink>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <span className="text-sm text-gray-500">{user?.nama}</span>
          <button
            onClick={() => void logout()}
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
