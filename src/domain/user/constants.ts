import { i18n } from '@/common/i18n'

export const USER_ENTITY_NAME = 'user'

export const ROLES = [
  { key: 'admin', value: i18n().modules.user.role.admin },
  { key: 'manager', value: i18n().modules.user.role.manager },
  { key: 'normal', value: i18n().modules.user.role.normal },
]

export const STATUSES = [
  { key: 'active', value: i18n().modules.user.status.active },
  { key: 'inactive', value: i18n().modules.user.status.inactive },
]
