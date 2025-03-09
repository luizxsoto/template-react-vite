import { Navigate, Route, Routes } from 'react-router-dom'

import { HasPermission } from '@/common/components/has-permission'
import { ALL_PERMISSION_KEYS } from '@/common/constants/permission-keys'
import { Forbidden } from '@/common/pages/forbidden'

import { UserForm } from './pages/form'
import { UserList } from './pages/list'
import { UserProfileForm } from './pages/profile'

export function UserRoutes(): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HasPermission
            permissionKey={ALL_PERMISSION_KEYS.user.list}
            element={<UserList />}
            fallBackElement={<Forbidden />}
          />
        }
      />

      <Route
        path="/form"
        element={
          <HasPermission
            permissionKey={ALL_PERMISSION_KEYS.user.create}
            element={<UserForm />}
            fallBackElement={<Forbidden />}
          />
        }
      />
      <Route
        path="/form/:id"
        element={
          <HasPermission
            permissionKey={ALL_PERMISSION_KEYS.user.show}
            element={<UserForm />}
            fallBackElement={<Forbidden />}
          />
        }
      />
      <Route path="/profile" element={<UserProfileForm />} />

      <Route path="*" element={<Navigate replace to="/not-found" />} />
    </Routes>
  )
}
