import * as yup from 'yup'

import { i18n } from '@/common/i18n'
import { isWithoutSpace } from '@/common/validators/string'

import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from './constants'

export const createSessionValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required(i18n().common.validators.required)
    .min(MIN_USERNAME_LENGTH, i18n().common.validators.min(MIN_USERNAME_LENGTH))
    .max(MAX_USERNAME_LENGTH, i18n().common.validators.max(MAX_USERNAME_LENGTH)),
  password: yup
    .string()
    .required(i18n().common.validators.required)
    .min(MIN_PASSWORD_LENGTH, i18n().common.validators.min(MIN_PASSWORD_LENGTH))
    .max(MAX_PASSWORD_LENGTH, i18n().common.validators.max(MAX_PASSWORD_LENGTH))
    .matches(/[A-Z]/, i18n().common.validators.uppercase)
    .matches(/[a-z]/, i18n().common.validators.lowercase)
    .matches(/[0-9]/, i18n().common.validators.number)
    .matches(/[!@#$%^&*()_+-=[{}|;:,.<>?.]/, i18n().common.validators.specialCharacter)
    .test('isWithoutSpace', i18n().common.validators.withoutSpace, isWithoutSpace),
})
