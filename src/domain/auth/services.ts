import { UnauthorizedException } from '@/common/exceptions/unauthorized'
import { i18n } from '@/common/i18n'
import { apiService, removeApiClientToken, setApiClientToken } from '@/common/services/api'
import {
  CreateSessionApiParams,
  CreateSessionApiResult,
  ForgotPasswordApiParams,
  ShowSessionApiResult,
} from '@/domain/auth/contracts/apis'
import {
  CreateSessionServiceParams,
  CreateSessionServiceResult,
  ResetPasswordServiceParams,
  ShowSessionServiceResult,
} from '@/domain/auth/contracts/services'
import { userFormatSanitizer } from '@/domain/user/sanitizers'

import { getTokenRepository, removeTokenRepository, saveTokenRepository } from './repositories'

export async function createSessionService(
  params: CreateSessionServiceParams,
): Promise<CreateSessionServiceResult> {
  const result = await apiService<CreateSessionApiParams, CreateSessionApiResult>({
    resource: i18n().modules.auth.resources.createSession,
    method: 'post',
    url: '/auth/v1/session',
    body: params,
  })

  saveTokenRepository(result.token)
  setApiClientToken(result.token)

  return { ...result, user: userFormatSanitizer([result.user])[0] }
}

export async function showSessionService(): Promise<ShowSessionServiceResult> {
  const token = getTokenRepository()
  if (!token) {
    throw new UnauthorizedException()
  }
  setApiClientToken(token)

  const result = await apiService<unknown, ShowSessionApiResult>({
    resource: i18n().modules.auth.resources.showSession,
    method: 'get',
    url: '/auth/v1/session',
    ignoreRefreshing: true,
  })

  return { user: userFormatSanitizer([result.user])[0] }
}

export async function forgotPasswordService(params: ForgotPasswordApiParams): Promise<void> {
  await apiService<ForgotPasswordApiParams, unknown>({
    resource: i18n().modules.auth.resources.forgotPassword,
    method: 'post',
    url: '/auth/v1/forgot-password',
    body: params,
  })
}

export async function resetPasswordService(params: ResetPasswordServiceParams): Promise<void> {
  await apiService<Omit<ResetPasswordServiceParams, 'code'> & { code: number }, unknown>({
    resource: i18n().modules.auth.resources.resetPassword,
    method: 'post',
    url: '/auth/v1/reset-password',
    body: params,
  })
}

export function logoutSessionService(): void {
  removeApiClientToken()
  removeTokenRepository()
}
