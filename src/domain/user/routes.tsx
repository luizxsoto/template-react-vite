import { Navigate, Route, Routes } from 'react-router-dom'

import { HasPermissionComponent } from '@/common/components'
import { ALL_PERMISSION_KEYS } from '@/common/constants'
import { Forbidden } from '@/common/pages/Forbidden'

import { UsersForm } from './pages/Form'
import { UsersList } from './pages/List'
import { UsersProfileForm } from './pages/Profile'

export function UserRoutes(): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HasPermissionComponent
            permissionKey={ALL_PERMISSION_KEYS.users.list}
            element={<UsersList />}
            fallBackElement={<Forbidden />}
          />
        }
      />

      <Route
        path="/form"
        element={
          <HasPermissionComponent
            permissionKey={ALL_PERMISSION_KEYS.users.create}
            element={<UsersForm />}
            fallBackElement={<Forbidden />}
          />
        }
      />
      <Route
        path="/form/:id"
        element={
          <HasPermissionComponent
            permissionKey={ALL_PERMISSION_KEYS.users.show}
            element={<UsersForm />}
            fallBackElement={<Forbidden />}
          />
        }
      />
      <Route path="/profile" element={<UsersProfileForm />} />

      <Route path="*" element={<Navigate replace to="/not-found" />} />
    </Routes>
  )
}
