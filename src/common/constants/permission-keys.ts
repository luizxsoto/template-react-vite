import { USER_ENTITY_NAME } from '@/domain/user/constants'

export const RESOURCES = {
  create: 'post',
  list: 'get',
  show: 'get/:id',
  update: 'put',
  remove: 'delete',
}

export const ALL_PERMISSION_KEYS = {
  user: {
    create: `${USER_ENTITY_NAME}.${RESOURCES.create}`,
    list: `${USER_ENTITY_NAME}.${RESOURCES.list}`,
    show: `${USER_ENTITY_NAME}.${RESOURCES.show}`,
    update: `${USER_ENTITY_NAME}.${RESOURCES.update}`,
    remove: `${USER_ENTITY_NAME}.${RESOURCES.remove}`,
  },
}

export const MANAGER_PERMISSION_KEYS = [
  ALL_PERMISSION_KEYS.user.list,
  ALL_PERMISSION_KEYS.user.show,
  ALL_PERMISSION_KEYS.user.update,
]
