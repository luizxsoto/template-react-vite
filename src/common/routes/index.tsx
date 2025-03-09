import { Navigate, Route, Routes as RouterDomRoutes } from 'react-router-dom'

import { useAuth } from '@/domain/auth/contexts'

import { NotSignedRoutes } from './not-signed'
import { SignedRoutes } from './signed'

export function Routes(): JSX.Element {
  const { isSigned } = useAuth()

  return (
    <RouterDomRoutes>
      <Route path="/*" element={isSigned ? <SignedRoutes /> : <NotSignedRoutes />} />

      <Route path="*" element={<Navigate replace to="/" />} />
    </RouterDomRoutes>
  )
}
