import axios, { AxiosError, AxiosResponse } from 'axios'

import { ApiServiceParams } from '@/common/contracts/apis'
import { StatusCodes } from '@/common/contracts/http'
import { ApplicationException } from '@/common/exceptions/application'
import { UnauthorizedException } from '@/common/exceptions/unauthorized'
import { getParsedException } from '@/common/helpers/exception'
import { isTokenOverdue } from '@/common/helpers/token'
import { i18n } from '@/common/i18n'
import { Token } from '@/domain/auth/contracts/models'
import { getTokenRepository, saveTokenRepository } from '@/domain/auth/repositories'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
})

let isRefreshing = false

const requestQueue: Array<{
  call: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
}> = []

async function callApi<RequestData, ResponseData>({
  resource,
  method,
  url,
  baseURL,
  params,
  body,
  headers,
}: Omit<ApiServiceParams<RequestData>, 'ignoreRefreshing'>): Promise<ResponseData> {
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
    .then((res) => res.data)
    .catch((error: AxiosError<ApplicationException>) => {
      const parsedError = (error.response?.data ?? error) as ApplicationException
      parsedError.statusCode = error.response?.status ?? StatusCodes.INTERNAL
      throw getParsedException(resource, parsedError)
    })
}

async function makeRefreshToken(): Promise<Token> {
  isRefreshing = true
  const refreshToken = getTokenRepository()?.refreshToken
  if (!refreshToken) {
    throw new ApplicationException({ message: i18n().common.services.api.refreshTokenError })
  }
  const apiResult = await callApi<{ refreshToken: string }, Omit<Token, 'refreshToken'>>({
    resource: i18n().common.services.api.makeRefreshToken,
    method: 'post',
    url: '/auth/v1/refresh-token',
    body: { refreshToken },
  }).catch((error) => {
    consumeQueue(true)
    throw error
  })

  const token: Token = {
    accessToken: apiResult.accessToken,
    refreshToken,
  }
  setApiClientToken(token)
  saveTokenRepository(token)
  consumeQueue()
  return token
}

export function consumeQueue(rejectAll = false): void {
  isRefreshing = false
  requestQueue.forEach(({ call, resolve, reject }) => {
    if (rejectAll) {
      reject(new UnauthorizedException())
    } else {
      call().then(resolve).catch(reject)
    }
  })
}

export function setIsRefreshing(value: boolean): void {
  isRefreshing = value
}

export function setApiClientToken({ accessToken }: Token): void {
  axiosClient.defaults.headers.authorization = `Bearer ${accessToken}`
}

export function removeApiClientToken(): void {
  axiosClient.defaults.headers.authorization = null
}

export async function apiService<RequestData, ResponseData>({
  ignoreRefreshing,
  ...params
}: ApiServiceParams<RequestData>): Promise<ResponseData> {
  const authorization = (params.headers?.authorization ??
    axiosClient.defaults.headers.authorization) as string
  if (authorization && isTokenOverdue(authorization)) {
    const token = await makeRefreshToken()
    if (params.headers?.authorization) {
      params.headers.authorization = `Bearer ${token.accessToken}`
    }
  }
  const call = async (): Promise<ResponseData> => callApi(params)
  if (isRefreshing && !ignoreRefreshing) {
    return new Promise((resolve, reject) => {
      requestQueue.push({
        call,
        resolve,
        reject,
      })
    })
  }
  return call()
}
