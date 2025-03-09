import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthRoutes } from '@/domain/auth/routes'

export function NotSignedRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />

      <Route path="*" element={<Navigate replace to="/not-found" />} />
    </Routes>
  )
}
