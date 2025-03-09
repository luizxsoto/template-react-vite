import { numberUnmask } from '@/common/helpers/number'

import { CreateSessionForm, ForgotPasswordForm, ResetPasswordForm } from './contracts/forms'

export function createSessionFormSanitizer(params: CreateSessionForm): CreateSessionForm {
  return {
    document: numberUnmask(params.document),
    password: params.password,
  }
}

export function forgotPasswordFormSanitizer(params: ForgotPasswordForm): ForgotPasswordForm {
  return {
    document: numberUnmask(params.document),
  }
}

export function resetPasswordFormSanitizer(params: ResetPasswordForm): ResetPasswordForm {
  return {
    code: Number(params.code),
    password: params.password,
    confirmPassword: params.confirmPassword,
  }
}
