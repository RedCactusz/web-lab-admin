import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Students from '@/pages/Students'
import AlatPage from '@/pages/Alat'
import PraktikumPage from '@/pages/Praktikum'
import PraktikumDetail from '@/pages/PraktikumDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="mahasiswa" element={<Students />} />
          <Route path="alat" element={<AlatPage />} />
          <Route path="praktikum" element={<PraktikumPage />} />
          <Route path="praktikum/:slug" element={<PraktikumDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
