import { useAuth } from '@/domain/auth/contexts'
import { UserRole } from '@/domain/user/contracts/models'

interface HasPermissionObject {
  permissionKey?: string
  role?: UserRole
  element: JSX.Element
  fallBackElement?: JSX.Element
}

export function HasPermission({
  permissionKey,
  role,
  element,
  fallBackElement,
}: HasPermissionObject): JSX.Element {
  const { hasPermission, loggedUser } = useAuth()

  if (!loggedUser) {
    return <></>
  }

  return hasPermission({ permissionKey, role }) ? element : (fallBackElement ?? <></>)
}
