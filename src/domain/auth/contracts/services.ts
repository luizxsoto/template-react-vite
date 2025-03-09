import { UserWithoutPasswordFormatted } from '@/domain/user/contracts/models'

import {
  CreateSessionApiParams,
  CreateSessionApiResult,
  ForgotPasswordApiParams,
  ResetPasswordApiParams,
} from './apis'

export interface CreateSessionServiceParams extends CreateSessionApiParams {}

export interface CreateSessionServiceResult extends Omit<CreateSessionApiResult, 'user'> {
  user: UserWithoutPasswordFormatted
}

export interface ShowSessionServiceResult {
  user: UserWithoutPasswordFormatted
}

export interface ForgotPasswordServiceParams extends ForgotPasswordApiParams {}

export interface ResetPasswordServiceParams extends ResetPasswordApiParams {}
