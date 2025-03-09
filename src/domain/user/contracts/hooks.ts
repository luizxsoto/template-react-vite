import { HookHandlers } from '@/common/contracts/hooks'

import {
  CreateUserServiceParams,
  CreateUserServiceResult,
  ListUserServiceParams,
  ListUserServiceResult,
  RemoveUserServiceParams,
  SendUserCredentialsServiceParams,
  ShowUserServiceParams,
  ShowUserServiceResult,
  UpdateUserProfileServiceParams,
  UpdateUserProfileServiceResult,
  UpdateUserServiceParams,
  UpdateUserServiceResult,
} from './services'

export interface CreateUserHookParams extends HookHandlers<CreateUserHookResult> {
  model: CreateUserServiceParams
}

export interface CreateUserHookResult extends CreateUserServiceResult {}

export interface ListUserHookParams extends HookHandlers<ListUserHookResult> {
  model: ListUserServiceParams
}

export interface ListUserHookResult extends ListUserServiceResult {}

export interface ShowUserHookParams extends HookHandlers<ShowUserHookResult> {
  model: Partial<ShowUserServiceParams>
}

export interface ShowUserHookResult extends ShowUserServiceResult {}

export interface UpdateUserHookParams extends HookHandlers<UpdateUserHookResult> {
  model: UpdateUserServiceParams
}

export interface UpdateUserHookResult extends UpdateUserServiceResult {}

export interface RemoveUserHookParams extends HookHandlers<unknown> {
  model: Partial<RemoveUserServiceParams>
}

export interface UpdateUserProfileHookParams extends HookHandlers<UpdateUserProfileHookResult> {
  model: UpdateUserProfileServiceParams
}

export interface UpdateUserProfileHookResult extends UpdateUserProfileServiceResult {}

export interface SendUserCredentialsHookParams extends HookHandlers<void> {
  model: SendUserCredentialsServiceParams
}
