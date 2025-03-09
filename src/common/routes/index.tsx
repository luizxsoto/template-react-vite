import { Route, Routes as RouterDomRoutes } from 'react-router-dom'

import { NotFound } from '@/common/pages/NotFound'
import { useAuth } from '@/domain/auth'

import { NotSignedRoutes } from './not-signed'
import { SignedRoutes } from './signed'

export function Routes(): JSX.Element {
  const { isSigned } = useAuth()

  return (
    <RouterDomRoutes>
      <Route path="/*" element={isSigned ? <SignedRoutes /> : <NotSignedRoutes />} />

      <Route path="/not-found" element={<NotFound />} />
    </RouterDomRoutes>
  )
}
