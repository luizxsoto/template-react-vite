import { Navigate, Route, Routes } from 'react-router-dom'

import { Login } from '@/domain/auth/pages/login'

export function NotSignedRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}
