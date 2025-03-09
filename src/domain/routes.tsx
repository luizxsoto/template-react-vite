import { Navigate, Route, Routes } from 'react-router-dom'

import { Home } from './auth/pages/home'

export function TemplateReactViteRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}
