import { Navigate, Route, Routes } from 'react-router-dom'

import { ForgotPassword } from './pages/forgot-password'
import { Login } from './pages/login'
import { ResetPassword } from './pages/reset-password'

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
