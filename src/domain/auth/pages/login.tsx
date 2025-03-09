import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  FormConfirmButton,
  FormContainer,
  FormGridContainer,
  FormTextInput,
} from '@/common/components/Form'
import { changePageTitle, documentMask } from '@/common/helpers'
import { i18n } from '@/common/i18n'
import { createSessionFormSanitizer, createSessionValidationSchema, useAuth } from '@/domain/auth'
import { CreateSessionForm } from '@/domain/auth/contracts'
import { BaseAuthLayout } from '@/domain/auth/layouts'

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
            gridProps={{ xs: 12 }}
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
            gridProps={{ xs: 12 }}
            required
            inputBox="filled"
          />

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            gridProps={{ xs: 12 }}
          >
            {i18n().modules.auth.pages.login.buttons.confirm}
          </FormConfirmButton>
        </FormGridContainer>
      </FormContainer>
    </BaseAuthLayout>
  )
}
