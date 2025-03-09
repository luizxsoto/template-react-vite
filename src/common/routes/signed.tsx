import { Navigate, Route, Routes } from 'react-router-dom'

import { Drawer } from '@/common/components/drawer'
import { UserRoutes } from '@/domain/user/routes'

export function SignedRoutes(): JSX.Element {
  return (
    <Drawer>
      <Routes>
        <Route path="/" element={<Navigate replace to="/user" />} />
        <Route path="/user/*" element={<UserRoutes />} />

        <Route path="*" element={<Navigate replace to="/not-found" />} />
      </Routes>
    </Drawer>
  )
}
