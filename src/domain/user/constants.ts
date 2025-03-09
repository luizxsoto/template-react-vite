import { i18n } from '@/common/i18n'

export const ENTITY_NAME = 'users'

export const ROLES = [
  { key: 'admin', value: i18n().modules.users.role.admin },
  { key: 'manager', value: i18n().modules.users.role.manager },
  { key: 'normal', value: i18n().modules.users.role.normal },
]

export const STATUSES = [
  { key: 'active', value: i18n().modules.users.status.active },
  { key: 'inactive', value: i18n().modules.users.status.inactive },
]
