import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { FormConfirmButton } from '@/common/components/form/confirm-button'
import { FormContainer } from '@/common/components/form/container'
import { FormGridContainer } from '@/common/components/form/grid-container'
import { FormTextInput } from '@/common/components/form/text-input'
import { documentMask } from '@/common/helpers/document'
import { changePageTitle } from '@/common/helpers/window'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'
import { ForgotPasswordForm } from '@/domain/auth/contracts/forms'
import { BaseAuthLayout } from '@/domain/auth/layouts/base'
import { forgotPasswordFormSanitizer } from '@/domain/auth/sanitizers'
import { forgotPasswordValidationSchema } from '@/domain/auth/validations'

export function ForgotPassword(): JSX.Element {
  changePageTitle(i18n().modules.auth.pages.forgotPassword.pageTitle)

  const { isLoading, forgotPassword } = useAuth()
  const navigate = useNavigate()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: async (values, ...args) =>
      yupResolver(forgotPasswordValidationSchema)(forgotPasswordFormSanitizer(values), ...args),
  })

  const hasAnyError = !!Object.keys(errors).length

  function handleReturnToLogin(): void {
    void navigate(-1)
  }

  function onSubmit(model: ForgotPasswordForm): void {
    forgotPassword({
      model,
      onSuccess: async () => navigate(`/passwords/reset?document=${model.document}`),
      onError: ({ validations }) => {
        if (validations) {
          Object.keys(validations).forEach((key) => {
            setError(key as 'root', { message: validations[key] })
          })
        }
      },
    })
  }

  return (
    <BaseAuthLayout title={i18n().modules.auth.pages.forgotPassword.title}>
      <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit}>
        <FormGridContainer spacing={2}>
          <FormTextInput
            label={i18n().modules.auth.pages.forgotPassword.inputs.document}
            control={control}
            name="document"
            mask={documentMask}
            error={errors.document?.message}
            inputProps={{ autoComplete: 'document' }}
            disabled={isLoading}
            gridProps={{ size: { xs: 12 } }}
            required
            inputBox="filled"
          />

          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button data-testid="Button-alreadyHasPassword" onClick={handleReturnToLogin}>
              {i18n().modules.auth.pages.forgotPassword.buttons.alreadyHasPassword}
            </Button>
          </Grid>
          <FormConfirmButton
            loading={isLoading}
            disabled={isLoading || hasAnyError}
            gridProps={{ size: { xs: 12 } }}
          >
            {i18n().modules.auth.pages.forgotPassword.buttons.confirm}
          </FormConfirmButton>
        </FormGridContainer>
      </FormContainer>
    </BaseAuthLayout>
  )
}
