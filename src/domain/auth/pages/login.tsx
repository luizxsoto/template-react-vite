import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormConfirmButton } from '@/common/components/form/confim-button'
import { FormContainer } from '@/common/components/form/container'
import { FormTextField } from '@/common/components/form/text-field'
import { UnauthorizedException } from '@/common/exceptions/unauthorized'
import { changePageTitle } from '@/common/helpers/document'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'
import { CreateSessionForm } from '@/domain/auth/contracts/forms'
import { createSessionFormSanitizer } from '@/domain/auth/sanitizers'
import { createSessionValidationSchema } from '@/domain/auth/validations'

export function Login(): JSX.Element {
  changePageTitle(i18n().domain.auth.pages.login.pageTitle)

  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { createSession, isLoading } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSessionForm>({
    resolver: async (values, ...args) =>
      yupResolver(createSessionValidationSchema)(createSessionFormSanitizer(values), ...args),
  })
  const hasAnyError = !!Object.keys(errors).length

  function onSubmit(params: CreateSessionForm): void {
    void createSession({
      params,
      onError: ({ error }) => {
        if (error.constructor === UnauthorizedException) {
          setIsInvalidCredentials(true)
        }
      },
    })
  }

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={({ spacing }) => ({ padding: spacing(2), width: '400px' })}>
        <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit}>
          <Grid2 container spacing={2}>
            <FormTextField
              variant="filled"
              name="username"
              label={i18n().domain.auth.pages.login.inputs.username}
              hasError={isInvalidCredentials || !!errors.username?.message}
              helperText={errors.username?.message}
              inputProps={{ autoComplete: 'username' }}
              control={control}
              disabled={isLoading}
              gridProps={{ size: 12 }}
              required
              onChange={() => setIsInvalidCredentials(false)}
            />
            <FormTextField
              variant="filled"
              name="password"
              label={i18n().domain.auth.pages.login.inputs.password}
              hasError={isInvalidCredentials || !!errors.password?.message}
              helperText={isInvalidCredentials ? 'Credenciais inválidas' : errors.password?.message}
              inputProps={{
                type: showPassword ? 'text' : 'password',
                autoComplete: 'current-password',
              }}
              control={control}
              disabled={isLoading}
              gridProps={{ size: 12 }}
              required
              onChange={() => setIsInvalidCredentials(false)}
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
            />

            <FormConfirmButton
              loading={isLoading}
              disabled={isLoading || hasAnyError}
              gridProps={{ size: 12 }}
            >
              {i18n().domain.auth.pages.login.buttons.confirm}
            </FormConfirmButton>
          </Grid2>
        </FormContainer>
      </Card>
    </Container>
  )
}
