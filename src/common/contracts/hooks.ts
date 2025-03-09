import { UseQueryOptions } from '@tanstack/react-query'

import { ApplicationException } from '@/common/exceptions/application'

export interface HookHandlers<ServiceResult = null> {
  queryOptions?: Omit<UseQueryOptions<ServiceResult, ApplicationException>, 'initialData'> & {
    initialData?: () => undefined
  }
  onSuccess?: (serviceResult: ServiceResult) => void
  onError?: (serviceResult: {
    error: ApplicationException
    validations?: Record<string, string>
  }) => void
}
