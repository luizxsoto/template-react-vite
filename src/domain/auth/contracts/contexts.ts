import { ContextHandlers } from '@/common/contracts/contexts'
import { UserWithoutPasswordFormatted } from '@/domain/user/contracts/models'

import {
  CreateSessionServiceParams,
  CreateSessionServiceResult,
  ForgotPasswordServiceParams,
  ResetPasswordServiceParams,
  ShowSessionServiceResult,
} from './services'

export interface CreateSessionContextParams extends ContextHandlers<CreateSessionContextResult> {
  model: CreateSessionServiceParams
}

export interface CreateSessionContextResult extends CreateSessionServiceResult {}

export interface ShowSessionContextParams extends ContextHandlers<ShowSessionContextResult> {}

export interface ShowSessionContextResult extends ShowSessionServiceResult {}

export interface SaveLoggedUserContextParams extends ContextHandlers<UserWithoutPasswordFormatted> {
  model: UserWithoutPasswordFormatted
}

export interface ForgotPasswordContextParams extends ContextHandlers<void> {
  model: ForgotPasswordServiceParams
}

export interface ResetPasswordContextParams extends ContextHandlers<void> {
  model: ResetPasswordServiceParams
}
