import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@/domain/auth/contexts'
import { TemplateReactViteRoutes } from '@/domain/routes'

export function SignedRoutes(): JSX.Element {
  const { isLoading } = useAuth()

  let element: JSX.Element = (
    <>
      <TemplateReactViteRoutes />
    </>
  )

  if (isLoading) {
    element = <h1>Carregando</h1>
  }

  return (
    <Routes>
      <Route path="/*" element={element} />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}
