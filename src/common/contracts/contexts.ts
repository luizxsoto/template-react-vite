import { ApplicationException } from '@/common/exceptions'

export interface ContextHandlers<ServiceResult> {
  onSuccess?: (serviceResult: ServiceResult) => void
  onError?: (serviceResult: {
    error: ApplicationException
    validations?: Record<string, string>
  }) => void
}
