import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  FormConfirmButton,
  FormContainer,
  FormGridContainer,
  FormTextInput,
} from '@/common/components/Form'
import { changePageTitle, numberUnmask } from '@/common/helpers'
import { i18n } from '@/common/i18n'
import { resetPasswordFormSanitizer, resetPasswordValidationSchema, useAuth } from '@/domain/auth'
import { ResetPasswordForm } from '@/domain/auth/contracts'
import { BaseAuthLayout } from '@/domain/auth/layouts'

export function ResetPassword(): JSX.Element {
  changePageTitle(i18n().modules.auth.pages.resetPassword.pageTitle)

  const { isLoading, resetPassword, createSession } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const documentParams = searchParams.get('document')
  const codeParams = searchParams.get('code')

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: { code: codeParams ? Number(codeParams) : undefined },
    resolver: async (values, ...args) =>
      yupResolver(resetPasswordValidationSchema)(resetPasswordFormSanitizer(values), ...args),
  })

  const hasAnyError = !!Object.keys(errors).length

  function handleReturnToLogin(): void {
    void navigate('/')
  }

  function onSubmit(model: ResetPasswordForm): void {
    resetPassword({
      model: { ...model, document: documentParams! },
      onSuccess: async () =>
        createSession({
          model: {
            document: documentParams!,
            password: model.password,
          },
          onSuccess: () => {
            void navigate('/')
          },
          onError: () => {
            void navigate('/')
          },
        }),
      onError: ({ validations }) => {
        if (validations) {
          Object.keys(validations).forEach((key) => {
            setError(key as 'root', { message: validations[key] })
          })
        }
      },
    })
  }

  useEffect(() => {
    if (!documentParams) {
      void navigate('/', { replace: true })
    }
  }, [documentParams, navigate])

  return (
    <BaseAuthLayout title={i18n().modules.auth.pages.resetPassword.title}>
      <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit}>
        <FormGridContainer spacing={2}>
          <FormTextInput
            label={i18n().modules.auth.pages.resetPassword.inputs.code}
            control={control}
            name="code"
            mask={numberUnmask}
            error={errors.code?.message}
            disabled={isLoading}
            maxLength={6}
            required
            inputBox="filled"
            gridProps={{ xs: 12 }}
          />
          <FormTextInput
            control={control}
            name="password"
            label={i18n().modules.auth.pages.resetPassword.inputs.password}
            error={errors.password?.message}
            required
            loading={isLoading}
            disabled={isLoading}
            inputBox="filled"
            inputProps={{ type: showPassword ? 'text' : 'password' }}
            endAdornment={
              <IconButton
                data-testid="IconButton-togglePassword"
                color="primary"
                onClick={() => setShowPassword((oldState: boolean) => !oldState)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <VisibilityIcon data-testid="Icon-visibilityIcon" />
                ) : (
                  <VisibilityOffIcon data-testid="Icon-visibilityOffIcon" />
                )}
              </IconButton>
            }
            gridProps={{ xs: 12 }}
          />
          <FormTextInput
            control={control}
            name="confirmPassword"
            label={i18n().modules.auth.pages.resetPassword.inputs.confirmPassword}
            error={errors.confirmPassword?.message}
            required
            loading={isLoading}
            disabled={isLoading}
            inputBox="filled"
            inputProps={{ type: showConfirmPassword ? 'text' : 'password' }}
            endAdornment={
              <IconButton
                data-testid="IconButton-toggleConfirmPassword"
                color="primary"
                onClick={() => setShowConfirmPassword((oldState: boolean) => !oldState)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <VisibilityIcon data-testid="Icon-visibilityIcon" />
                ) : (
                  <VisibilityOffIcon data-testid="Icon-visibilityOffIcon" />
                )}
              </IconButton>
            }
            gridProps={{ xs: 12 }}
          />

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleReturnToLogin} data-testid="Button-backToLogin">
              {i18n().modules.auth.pages.resetPassword.buttons.backToLogin}
            </Button>
          </Grid>
          <FormConfirmButton
            loading={isLoading}
            disabled={isLoading || hasAnyError}
            gridProps={{ xs: 12 }}
          >
            {i18n().modules.auth.pages.resetPassword.buttons.confirm}
          </FormConfirmButton>
        </FormGridContainer>
      </FormContainer>
    </BaseAuthLayout>
  )
}
