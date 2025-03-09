import { CreateUserServiceParams, UpdateUserProfileServiceParams } from './services'

export interface CreateUserForm extends CreateUserServiceParams {
  changePassword: boolean
  confirmPassword?: string
}

export interface UpdateUserProfileForm extends UpdateUserProfileServiceParams {
  document: string
  changePassword: boolean
  confirmPassword?: string
}
