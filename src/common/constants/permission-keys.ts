import { ENTITY_NAME as USERS_ENTITY_NAME } from '@/domain/user'

export const RESOURCES = {
  create: 'post',
  list: 'get',
  show: 'get/:id',
  update: 'put',
  remove: 'delete',
}

export const ALL_PERMISSION_KEYS = {
  users: {
    create: `${USERS_ENTITY_NAME}.${RESOURCES.create}`,
    list: `${USERS_ENTITY_NAME}.${RESOURCES.list}`,
    show: `${USERS_ENTITY_NAME}.${RESOURCES.show}`,
    update: `${USERS_ENTITY_NAME}.${RESOURCES.update}`,
    remove: `${USERS_ENTITY_NAME}.${RESOURCES.remove}`,
  },
}

export const MANAGER_PERMISSION_KEYS = [
  ALL_PERMISSION_KEYS.users.list,
  ALL_PERMISSION_KEYS.users.show,
  ALL_PERMISSION_KEYS.users.update,
]
