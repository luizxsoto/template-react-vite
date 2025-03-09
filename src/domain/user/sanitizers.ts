import { documentMask } from '@/common/helpers/document'
import { numberUnmask } from '@/common/helpers/number'
import { phoneMask } from '@/common/helpers/phone'
import { removeSpaces } from '@/common/helpers/string'
import { i18n } from '@/common/i18n'

import { CreateUserForm, UpdateUserProfileForm } from './contracts/forms'
import { UserWithoutPassword, UserWithoutPasswordFormatted } from './contracts/models'

export function userFormatSanitizer<Model extends UserWithoutPassword>(
  users: Model[],
): Array<Model & UserWithoutPasswordFormatted> {
  return users.map((user) => {
    return {
      ...user,
      documentFormatted: documentMask(user.document),
      phoneFormatted: phoneMask(user.phone),
      statusFormatted: i18n().modules.user.status[user.status],
      roleFormatted: i18n().modules.user.role[user.role],
      createdAtFormatted: new Date(user.createdAt).toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  })
}

export function baseUserFormSanitizer(
  params: Partial<Omit<UpdateUserProfileForm, 'image'>>,
): Omit<UpdateUserProfileForm, 'image'> {
  const parsedParams: Omit<UpdateUserProfileForm, 'image'> = {
    name: removeSpaces(params.name),
    email: params.email!,
    document: numberUnmask(params.document),
    changePassword: params.changePassword || false,
    password: params.password,
    confirmPassword: params.confirmPassword,
    phone: numberUnmask(params.phone) || undefined,
  }

  if (!parsedParams.changePassword) {
    delete parsedParams.password
    delete parsedParams.confirmPassword
  }

  return parsedParams
}

export function updateUserProfileFormSanitizer(
  params: Partial<UpdateUserProfileForm>,
): UpdateUserProfileForm {
  return {
    ...baseUserFormSanitizer(params),
    image: params.image,
  }
}

export function createUserFormSanitizer(params: Partial<CreateUserForm>): CreateUserForm {
  return {
    ...baseUserFormSanitizer(params),
    status: params.status!,
    role: params.role!,
  }
}
