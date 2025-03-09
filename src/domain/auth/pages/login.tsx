import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
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
import { CreateSessionForm } from '@/domain/auth/contracts/forms'
import { BaseAuthLayout } from '@/domain/auth/layouts/base'
import { createSessionFormSanitizer } from '@/domain/auth/sanitizers'
import { createSessionValidationSchema } from '@/domain/auth/validations'

export function Login(): JSX.Element {
  changePageTitle(i18n().modules.auth.pages.login.pageTitle)

  const [showPassword, setShowPassword] = useState(false)

  const { createSession, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateSessionForm>({
    resolver: async (values, ...args) =>
      yupResolver(createSessionValidationSchema)(createSessionFormSanitizer(values), ...args),
  })
  const hasAnyError = !!Object.keys(errors).length

  function onSubmit(model: CreateSessionForm): void {
    void createSession({
      model,
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
    <BaseAuthLayout title={i18n().modules.auth.pages.login.title}>
      <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit}>
        <FormGridContainer spacing={2}>
          <FormTextInput
            label={i18n().modules.auth.pages.login.inputs.document}
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
          <FormTextInput
            label={i18n().modules.auth.pages.login.inputs.password}
            control={control}
            name="password"
            error={errors.password?.message}
            inputProps={{
              type: showPassword ? 'text' : 'password',
              autoComplete: 'current-password',
            }}
            endAdornment={
              <IconButton
                data-testid="IconButton-togglePassword"
                color="primary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <VisibilityIcon data-testid="Icon-visibilityIcon" />
                ) : (
                  <VisibilityOffIcon data-testid="Icon-visibilityOffIcon" />
                )}
              </IconButton>
            }
            disabled={isLoading}
            gridProps={{ size: { xs: 12 } }}
            required
            inputBox="filled"
          />

          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              data-testid="Button-forgotPassword"
              onClick={async () => navigate('/passwords/forgot')}
            >
              {i18n().modules.auth.pages.login.buttons.forgotPassword}
            </Button>
          </Grid>

          <FormConfirmButton
            loading={isLoading}
            disabled={isLoading || hasAnyError}
            gridProps={{ size: { xs: 12 } }}
          >
            {i18n().modules.auth.pages.login.buttons.confirm}
          </FormConfirmButton>
        </FormGridContainer>
      </FormContainer>
    </BaseAuthLayout>
  )
}
