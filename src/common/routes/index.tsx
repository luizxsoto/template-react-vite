import { Route, Routes as RouterDomRoutes } from 'react-router-dom'

import { WrappedLoader } from '@/common/components/wrapped-loader'
import { NotFound } from '@/common/pages/not-found'
import { useAuth } from '@/domain/auth/contexts'

import { NotSignedRoutes } from './not-signed'
import { SignedRoutes } from './signed'

export function Routes(): JSX.Element {
  const { isSigned, isLoading } = useAuth()

  return (
    <RouterDomRoutes>
      <Route
        path="/*"
        element={
          isSigned && isLoading ? (
            <WrappedLoader />
          ) : isSigned ? (
            <SignedRoutes />
          ) : (
            <NotSignedRoutes />
          )
        }
      />

      <Route path="/not-found" element={<NotFound />} />
    </RouterDomRoutes>
  )
}
