import { FilterType, OperatorType } from '@/common/contracts/services'
import { numberUnmask } from '@/common/helpers/number'
import { compareStrings } from '@/common/helpers/string'
import { i18n } from '@/common/i18n'
import { apiService } from '@/common/services/api'

import { ROLES } from './constants'
import {
  CreateUserApiParams,
  CreateUserApiResult,
  ListUserApiParams,
  ListUserApiResult,
  RemoveUserApiParams,
  SendUserCredentialsApiParams,
  ShowUserApiParams,
  ShowUserApiResult,
  UpdateUserApiParams,
  UpdateUserApiResult,
  UpdateUserProfileApiParams,
  UpdateUserProfileApiResult,
} from './contracts/apis'
import {
  CreateUserServiceParams,
  CreateUserServiceResult,
  ListUserServiceParams,
  ListUserServiceResult,
  RemoveUserServiceParams,
  ShowUserServiceParams,
  ShowUserServiceResult,
  UpdateUserProfileServiceParams,
  UpdateUserProfileServiceResult,
  UpdateUserServiceParams,
  UpdateUserServiceResult,
} from './contracts/services'
import { userFormatSanitizer } from './sanitizers'

export async function createUserService(
  params: CreateUserServiceParams,
): Promise<CreateUserServiceResult> {
  const result = await apiService<CreateUserApiParams, CreateUserApiResult>({
    resource: i18n().modules.user.resources.create,
    method: 'post',
    url: '/user/v1/user',
    body: params,
  })

  return userFormatSanitizer([result])[0]
}

export async function listUserService({
  search,
  ...params
}: ListUserServiceParams): Promise<ListUserServiceResult> {
  const filters: Array<FilterType | OperatorType> = []
  if (search) {
    const searchFilter: OperatorType = [
      '|',
      [':', 'name', search],
      [':', 'email', search],
      [':', 'document', numberUnmask(search) || search],
    ]
    const roleFound = ROLES.find((role) => compareStrings(role.value, search.toLowerCase()))
    if (roleFound) {
      searchFilter.push(['=', 'role', roleFound.key])
    }
    filters.push(searchFilter)
  }

  const { registers, ...result } = await apiService<ListUserApiParams, ListUserApiResult>({
    resource: i18n().modules.user.resources.list,
    method: 'get',
    url: '/user/v1/user',
    params: { ...params, filters: filters.length ? JSON.stringify(['&', ...filters]) : undefined },
  })

  return { ...result, registers: userFormatSanitizer(registers) }
}

export async function showUserService(
  params: ShowUserServiceParams,
): Promise<ShowUserServiceResult> {
  const result = await apiService<ShowUserApiParams, ShowUserApiResult>({
    resource: i18n().modules.user.resources.show,
    method: 'get',
    url: `/user/v1/user/${params.id}`,
  })

  return userFormatSanitizer([result])[0]
}

export async function updateUserService({
  id,
  ...params
}: UpdateUserServiceParams): Promise<UpdateUserServiceResult> {
  const result = await apiService<Omit<UpdateUserApiParams, 'id'>, UpdateUserApiResult>({
    resource: i18n().modules.user.resources.update,
    method: 'patch',
    url: `/user/v1/user/${id}`,
    body: params,
  })

  return userFormatSanitizer([result])[0]
}

export async function removeUserService({ id }: RemoveUserServiceParams): Promise<void> {
  await apiService<Omit<RemoveUserApiParams, 'id'>, unknown>({
    resource: i18n().modules.user.resources.remove,
    method: 'delete',
    url: `/user/v1/user/${id}`,
  })
}

export async function updateUserProfileService(
  params: UpdateUserProfileServiceParams,
): Promise<UpdateUserProfileServiceResult> {
  const result = await apiService<UpdateUserProfileApiParams, UpdateUserProfileApiResult>({
    resource: i18n().modules.user.resources.updateProfile,
    method: 'patch',
    url: '/user/v1/profile',
    body: params,
  })

  return userFormatSanitizer([result])[0]
}

export async function sendUserCredentialsService({
  id,
}: SendUserCredentialsApiParams): Promise<void> {
  await apiService<SendUserCredentialsApiParams, unknown>({
    resource: i18n().modules.user.resources.sendUserCredentials,
    method: 'patch',
    url: `/user/v1/user/send-credentials/${id}`,
  })
}
