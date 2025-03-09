import { ListServiceParams, ListServiceResult } from '@/common/contracts/services'

import { UserRole, UserStatus, UserWithoutPassword } from './models'

export interface CreateUserApiParams {
  name: string
  email: string
  document: string
  password?: string
  phone?: string
  status: UserStatus
  role: UserRole
  image?: string
}

export interface CreateUserApiResult extends UserWithoutPassword {}

export interface ListUserApiParams extends ListServiceParams {
  name?: string
}

export interface ListUserApiResult extends ListServiceResult<UserWithoutPassword> {}

export interface ShowUserApiParams {
  id: string
}

export interface ShowUserApiResult extends UserWithoutPassword {}

export interface UpdateUserApiParams extends CreateUserApiParams {}

export interface UpdateUserApiResult extends CreateUserApiResult {}

export interface RemoveUserApiParams {
  id: string
}

export interface UpdateUserProfileApiParams
  extends Omit<UpdateUserApiParams, 'document' | 'role' | 'status'> {}

export interface UpdateUserProfileApiResult extends UpdateUserApiResult {}

export interface SendUserCredentialsApiParams {
  id: string
}
