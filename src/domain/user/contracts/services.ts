import { ListServiceResult } from '@/common/contracts/services'

import {
  CreateUserApiParams,
  ListUserApiParams,
  RemoveUserApiParams,
  SendUserCredentialsApiParams,
  ShowUserApiParams,
  UpdateUserApiParams,
  UpdateUserProfileApiParams,
} from './apis'
import { UserWithoutPasswordFormatted } from './models'

export interface CreateUserServiceParams extends CreateUserApiParams {}

export interface CreateUserServiceResult extends UserWithoutPasswordFormatted {}

export interface ListUserServiceParams extends Omit<ListUserApiParams, 'filters'> {
  search?: string
}

export interface ListUserServiceResult extends ListServiceResult<UserWithoutPasswordFormatted> {}

export interface ShowUserServiceParams extends ShowUserApiParams {}

export interface ShowUserServiceResult extends UserWithoutPasswordFormatted {}

export interface UpdateUserServiceParams extends UpdateUserApiParams {
  id: string
}

export interface UpdateUserServiceResult extends UserWithoutPasswordFormatted {}

export interface RemoveUserServiceParams extends RemoveUserApiParams {}

export interface UpdateUserProfileServiceParams extends UpdateUserProfileApiParams {}

export interface UpdateUserProfileServiceResult extends UserWithoutPasswordFormatted {}

export interface SendUserCredentialsServiceParams extends SendUserCredentialsApiParams {}
