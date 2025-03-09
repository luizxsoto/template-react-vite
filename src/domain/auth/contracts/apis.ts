import { UserWithoutPassword } from '@/domain/user/contracts/models'

import { Token } from './models'

export interface TokenPayloadApi {
  userId: string
  exp: number
}

export interface CreateSessionApiParams {
  document: string
  password: string
}

export interface CreateSessionApiResult {
  user: UserWithoutPassword
  token: Token
}

export interface ShowSessionApiResult {
  user: UserWithoutPassword
}

export interface ForgotPasswordApiParams {
  document: string
}

export interface ResetPasswordApiParams extends ForgotPasswordApiParams {
  code: number
  password: string
}
