import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { FormConfirmButton } from '@/common/components/form/confirm-button'
import { FormContainer } from '@/common/components/form/container'
import { FormGridContainer } from '@/common/components/form/grid-container'
import { FormTextInput } from '@/common/components/form/text-input'
import { numberUnmask } from '@/common/helpers/number'
import { changePageTitle } from '@/common/helpers/window'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'
import { ResetPasswordForm } from '@/domain/auth/contracts/forms'
import { BaseAuthLayout } from '@/domain/auth/layouts/base'
import { resetPasswordFormSanitizer } from '@/domain/auth/sanitizers'
import { resetPasswordValidationSchema } from '@/domain/auth/validations'

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
            gridProps={{ size: { xs: 12 } }}
          />
          <FormTextInput
            control={control}
            name="password"
            label={i18n().modules.auth.pages.resetPassword.inputs.password}
            error={errors.password?.message}
            required
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
            gridProps={{ size: { xs: 12 } }}
          />
          <FormTextInput
            control={control}
            name="confirmPassword"
            label={i18n().modules.auth.pages.resetPassword.inputs.confirmPassword}
            error={errors.confirmPassword?.message}
            required
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
            gridProps={{ size: { xs: 12 } }}
          />

          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleReturnToLogin} data-testid="Button-backToLogin">
              {i18n().modules.auth.pages.resetPassword.buttons.backToLogin}
            </Button>
          </Grid>
          <FormConfirmButton
            loading={isLoading}
            disabled={isLoading || hasAnyError}
            gridProps={{ size: { xs: 12 } }}
          >
            {i18n().modules.auth.pages.resetPassword.buttons.confirm}
          </FormConfirmButton>
        </FormGridContainer>
      </FormContainer>
    </BaseAuthLayout>
  )
}
