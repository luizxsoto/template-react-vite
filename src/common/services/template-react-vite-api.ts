import axios, { AxiosError, AxiosResponse } from 'axios'

import { ApiServiceParams, ApiServiceResult } from '@/common/contracts/apis'
import { ApplicationException } from '@/common/exceptions/application'
import { UnauthorizedException } from '@/common/exceptions/unauthorized'
import { getParsedException } from '@/common/helpers/exception'
import { isTokenOverdue } from '@/common/helpers/token'
import { RefreshTokenApiParams, TokenApi } from '@/domain/auth/contracts/apis'
import { Token } from '@/domain/auth/contracts/models'
import { getTokenRepository, saveTokenRepository } from '@/domain/auth/repositories'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_TEMPLATE_REACT_VITE_API_URL,
  timeout: 30000,
})

let isRefreshing = false
let defaultToken: Token | undefined

const requestQueue: Array<{
  call: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
}> = []

async function callApi<RequestData, ResponseData>({
  method,
  url,
  baseURL,
  params,
  body,
  headers,
}: Omit<ApiServiceParams<RequestData>, 'ignoreRefreshing'>): Promise<
  ApiServiceResult<ResponseData>
> {
  return axiosClient
    .request<ApiServiceParams<RequestData>['body'], AxiosResponse<ResponseData>>({
      method,
      url,
      baseURL,
      params,
      data: body,
      headers: {
        ...axiosClient.defaults.headers,
        ...headers,
      } as Record<string, string>,
    })
    .then((res) => ({ data: res.data, headers: res.headers as Record<string, string> }))
    .catch((error: AxiosError<ApplicationException>) => {
      const parsedError = (error.response?.data ?? error) as ApplicationException
      parsedError.statusCode = error.response?.status ?? 500
      throw getParsedException(parsedError)
    })
}

async function makeRefreshToken(): Promise<Token> {
  isRefreshing = true
  const oldToken = getTokenRepository()
  if (!oldToken) {
    consumeTemplateReactViteQueue(true)
    throw new UnauthorizedException()
  }
  const { data } = await callApi<RefreshTokenApiParams, Omit<TokenApi, 'refresh_token'>>({
    method: 'post',
    url: '/Auth/v1/AuthV1/refreshUserToken',
    body: { refresh_token: oldToken.refreshToken },
  }).catch(() => {
    consumeTemplateReactViteQueue(true)
    throw new UnauthorizedException()
  })

  const newToken: Token = {
    accessToken: data.access_token,
    refreshToken: oldToken.refreshToken,
  }
  setTemplateReactViteApiClientToken(newToken)
  saveTokenRepository(newToken)
  consumeTemplateReactViteQueue()
  return newToken
}

export function consumeTemplateReactViteQueue(rejectAll = false): void {
  isRefreshing = false
  requestQueue.forEach(({ call, resolve, reject }) => {
    if (rejectAll) {
      reject(new UnauthorizedException())
    } else {
      call().then(resolve).catch(reject)
    }
  })
}

export function removeTemplateReactViteApiClientToken(): void {
  defaultToken = undefined
  axiosClient.defaults.headers.token = null
}

export function setTemplateReactViteApiClientToken(token: Token): void {
  defaultToken = token
}

export function getTemplateReactViteApiClientToken(): Token | undefined {
  return defaultToken
}

export async function templateReactViteApiService<RequestData, ResponseData>({
  ignoreRefreshing,
  ...params
}: ApiServiceParams<RequestData>): Promise<ApiServiceResult<ResponseData>> {
  if (defaultToken?.accessToken && isTokenOverdue(defaultToken.accessToken) && !isRefreshing) {
    await makeRefreshToken()
  }
  const call = async (): Promise<ApiServiceResult<ResponseData>> =>
    callApi({ ...params, headers: { ...params.headers, token: defaultToken?.accessToken } })
  if (isRefreshing && !ignoreRefreshing) {
    return new Promise((resolve, reject) => {
      requestQueue.push({ call, resolve, reject })
    })
  }
  return call()
}
