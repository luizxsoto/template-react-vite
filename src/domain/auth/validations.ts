import * as yup from 'yup'

import { i18n } from '@/common/i18n'
import { isValidDocument } from '@/common/validators/document'
import { isWithoutSpace } from '@/common/validators/string'

import {
  CODE_MAX_VALUE,
  CODE_MIN_VALUE,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from './constants'

export const passwordValidationSchema = yup
  .string()
  .required(i18n().common.validators.required)
  .min(MIN_PASSWORD_LENGTH, i18n().common.validators.min(MIN_PASSWORD_LENGTH))
  .max(MAX_PASSWORD_LENGTH, i18n().common.validators.max(MAX_PASSWORD_LENGTH))
  .matches(/[A-Z]/, i18n().common.validators.uppercase)
  .matches(/[a-z]/, i18n().common.validators.lowercase)
  .matches(/[0-9]/, i18n().common.validators.number)
  .matches(/[!@#$%^&*()_+-=[{}|;:,.<>?.]/, i18n().common.validators.specialCharacter)
  .test('isWithoutSpace', i18n().common.validators.withoutSpace, isWithoutSpace)

export const createSessionValidationSchema = yup.object().shape({
  document: yup
    .string()
    .required(i18n().common.validators.required)
    .test('isValidDocument', i18n().common.validators.document, isValidDocument),
  password: passwordValidationSchema,
})

export const forgotPasswordValidationSchema = yup.object().shape({
  document: yup
    .string()
    .required(i18n().common.validators.required)
    .test('isValidDocument', i18n().common.validators.document, isValidDocument),
})

export const resetPasswordValidationSchema = yup.object().shape({
  code: yup
    .number()
    .required(i18n().common.validators.required)
    .min(CODE_MIN_VALUE, i18n().common.validators.code)
    .max(CODE_MAX_VALUE, i18n().common.validators.code),
  password: passwordValidationSchema,
  confirmPassword: passwordValidationSchema.oneOf(
    [yup.ref('password')],
    i18n().common.validators.sameOf,
  ),
})
