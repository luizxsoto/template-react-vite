import * as yup from 'yup'

import { TELEPHONE_LENGTH } from '@/common/constants/phone'
import { i18n } from '@/common/i18n'
import { isValidDocument } from '@/common/validators/document'
import { passwordValidationSchema } from '@/domain/auth/validations'

import { UserRole, UserStatus } from './contracts/models'

export const updateUserValidationSchema = yup.object().shape({
  name: yup.string().required(i18n().common.validators.required),
  email: yup
    .string()
    .required(i18n().common.validators.required)
    .email(i18n().common.validators.email),
  document: yup
    .string()
    .required(i18n().common.validators.required)
    .test('isValidDocument', i18n().common.validators.document, isValidDocument),
  changePassword: yup.boolean().required(i18n().common.validators.required),
  password: yup.string().when('changePassword', {
    is: true,
    then: () => passwordValidationSchema,
  }),
  confirmPassword: yup.string().when('changePassword', {
    is: true,
    then: () =>
      passwordValidationSchema.oneOf([yup.ref('password')], i18n().common.validators.sameOf),
  }),
  phone: yup.string().min(TELEPHONE_LENGTH, i18n().common.validators.min(TELEPHONE_LENGTH)),
})

export const updateUserProfileValidationSchema = updateUserValidationSchema.shape({
  image: yup.string(),
})

export const createUserValidationSchema = updateUserValidationSchema.shape({
  status: yup.mixed<UserStatus>().required(i18n().common.validators.required),
  role: yup.mixed<UserRole>().required(i18n().common.validators.required),
})
