import axios, { AxiosError, AxiosResponse } from 'axios'

import { ApiServiceResult } from '@/common/contracts/apis'
import { ApplicationException } from '@/common/exceptions/application'
import { getParsedException } from '@/common/helpers/exception'

interface ApiServiceParams<RequestData> {
  method: 'delete' | 'get' | 'patch' | 'post' | 'put'
  url: string
  baseURL?: string
  params?: RequestData
  body?: RequestData
  headers?: Record<string, unknown>
}

const axiosClient = axios.create({ timeout: 30000 })

export async function apiService<RequestData, ResponseData>({
  method,
  url,
  baseURL,
  params,
  body,
  headers,
}: ApiServiceParams<RequestData>): Promise<ApiServiceResult<ResponseData>> {
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
