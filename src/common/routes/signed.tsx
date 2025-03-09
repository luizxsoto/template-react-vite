import { Navigate, Route, Routes } from 'react-router-dom'

import { Drawer } from '@/common/components/Drawer'
import { UserRoutes } from '@/domain/user'

export function SignedRoutes(): JSX.Element {
  return (
    <Drawer>
      <Routes>
        <Route path="/" element={<Navigate replace to="/users" />} />
        <Route path="/users/*" element={<UserRoutes />} />

        <Route path="*" element={<Navigate replace to="/not-found" />} />
      </Routes>
    </Drawer>
  )
}
