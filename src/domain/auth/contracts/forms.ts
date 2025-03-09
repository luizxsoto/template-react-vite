import {
  CreateSessionServiceParams,
  ForgotPasswordServiceParams,
  ResetPasswordServiceParams,
} from './services'

export interface CreateSessionForm extends CreateSessionServiceParams {}

export interface ForgotPasswordForm extends ForgotPasswordServiceParams {}

export interface ResetPasswordForm extends Omit<ResetPasswordServiceParams, 'document'> {
  confirmPassword: string
}
