import { ApplicationException } from '@/common/exceptions/application'

export interface ContextHandlers<ServiceResult> {
  onSuccess?: (serviceResult: ServiceResult) => void
  onError?: (serviceResult: {
    error: ApplicationException
    validations?: Record<string, string>
  }) => void
}
