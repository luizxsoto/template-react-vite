import { Navigate, Route, Routes } from 'react-router-dom'

import { ForgotPassword } from './pages/ForgotPassword'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'

export function AuthRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/passwords/forgot" element={<ForgotPassword />} />
      <Route path="/passwords/reset" element={<ResetPassword />} />

      <Route path="*" element={<Navigate replace to="/not-found" />} />
    </Routes>
  )
}
