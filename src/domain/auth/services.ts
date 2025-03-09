import { removeLastActionAtRepository } from '@/common/repositories/idle-timer'
import {
  getTemplateReactViteApiClientToken,
  removeTemplateReactViteApiClientToken,
  setTemplateReactViteApiClientToken,
  templateReactViteApiService,
} from '@/common/services/template-react-vite-api'

import {
  CreateSessionApiParams,
  CreateSessionApiResult,
  ShowSessionApiResult,
} from './contracts/apis'
import { Token } from './contracts/models'
import { CreateSessionServiceParams, ShowSessionServiceResult } from './contracts/services'
import { getTokenRepository, removeTokenRepository, saveTokenRepository } from './repositories'
import { apiSessionSanitizer, apiTokenSanitizer } from './sanitizers'

export async function createSessionService(
  params: CreateSessionServiceParams,
): Promise<ShowSessionServiceResult> {
  const { data } = await templateReactViteApiService<
    CreateSessionApiParams,
    CreateSessionApiResult
  >({
    method: 'post',
    url: '/auth/v1/session',
    body: params,
  })

  const token = apiTokenSanitizer(data.token)
  setTemplateReactViteApiClientToken(token)
  saveTokenRepository(token)

  return apiSessionSanitizer(data)
}

export async function showSessionService(): Promise<ShowSessionServiceResult> {
  const { data } = await templateReactViteApiService<null, ShowSessionApiResult>({
    method: 'get',
    url: '/auth/v1/session',
    ignoreRefreshing: true,
  })

  const session = apiSessionSanitizer(data)

  const token = getTemplateReactViteApiClientToken()
  if (token) {
    saveTokenRepository(token)
  }

  return session
}

export function loadTemplateReactViteApiClientService(): { token: Token } | null {
  const token = getTokenRepository()
  if (token) {
    setTemplateReactViteApiClientToken(token)
    return { token }
  }
  return null
}

export function logoutService(): void {
  removeTemplateReactViteApiClientToken()
  removeTokenRepository()
  removeLastActionAtRepository()
}
