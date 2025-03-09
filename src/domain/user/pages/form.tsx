import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Image } from '@/common/components'
import {
  FormCancelButton,
  FormConfirmButton,
  FormContainer,
  FormGridContainer,
  FormGridItem,
  FormSelectInput,
  FormSwitch,
  FormTextInput,
} from '@/common/components/Form'
import { changePageTitle, documentMask, phoneMask } from '@/common/helpers'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth'
import {
  ROLES,
  STATUSES,
  createUserFormSanitizer,
  createUserValidationSchema,
  useCreateUser,
  useShowUser,
  useUpdateUser,
} from '@/domain/user'
import { CreateUserForm, UserRole } from '@/domain/user/contracts'

export function UsersForm(): JSX.Element {
  changePageTitle(i18n().modules.users.pages.form.pageTitle)

  const pathParams = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [dialogState, setDialogState] = useState<{
    open: boolean
    model: CreateUserForm | undefined
  }>({ open: false, model: undefined })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { data, isLoading } = useShowUser({
    model: { id: pathParams.id },
    onError: () => {
      void navigate('/users')
    },
  })
  const { hasPermission } = useAuth()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const showLoading = Boolean(pathParams.id && isLoading)
  const formLoading = createUser.isPending || updateUser.isPending

  const canEdit = useMemo<boolean>(() => {
    const method = new URLSearchParams(location.search).get('method')
    return method === 'update' || !method
  }, [location])

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserForm>({
    defaultValues: { changePassword: false },
    resolver: async (values, ...args) =>
      yupResolver(createUserValidationSchema)(createUserFormSanitizer(values), ...args),
  })
  const hasAnyError = !!Object.keys(errors).length
  const changePassword = watch('changePassword')

  function handleCancel(): void {
    void navigate(-1)
  }

  function submit(model: CreateUserForm | undefined): void {
    if (model) {
      const params = {
        model,
        onSuccess: handleCancel,
        onError: ({ validations }: { validations?: Record<string, string> }) => {
          if (validations) {
            Object.keys(validations).forEach((key) => {
              setError(key as 'root', { message: validations[key] })
            })
          }
        },
      }
      if (canEdit) {
        if (data?.id) {
          updateUser.mutate({ ...params, model: { ...params.model, id: data.id } })
        } else {
          createUser.mutate(params)
        }
      }
    }
  }

  function onSubmit(model: CreateUserForm): void {
    if (model.role === UserRole.MANAGER && data?.role !== UserRole.MANAGER) {
      setDialogState({ open: true, model })
    } else {
      submit(model)
    }
  }

  function handleConfirmAction(): void {
    setDialogState({ open: false, model: undefined })
    submit(dialogState.model)
  }

  function handleCloseDialog(): void {
    setDialogState({ open: false, model: undefined })
  }

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        changePassword: false,
        document: data.documentFormatted,
        phone: data.phoneFormatted ?? '',
        email: data.email ?? '',
        image: data.image ?? '',
      })
    }
  }, [reset, data])

  useEffect(() => {
    if (!changePassword && (errors.password ?? errors.confirmPassword)) {
      clearErrors(['password', 'confirmPassword'])
    }
  }, [changePassword, clearErrors, errors.confirmPassword, errors.password])

  return (
    <Container
      sx={{
        display: 'flex',
        padding: '1rem',
        gap: '1rem',
        flexDirection: 'column',
      }}
    >
      <Dialog
        slotProps={{ root: { ['data-testid' as 'role']: 'RemoveDialog' } }}
        open={dialogState.open}
        onClose={handleCloseDialog}
      >
        <Grid
          container
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <DialogTitle>{i18n().common.components.table.body.attention}</DialogTitle>

          <IconButton onClick={handleCloseDialog} color="primary" sx={{ marginRight: '1rem' }}>
            <CloseIcon />
          </IconButton>
        </Grid>

        <DialogContent>
          <Typography variant="h6">
            {i18n().modules.users.pages.form.content.helperTexts.role}
          </Typography>

          <FormGridContainer spacing={2} sx={{ marginTop: '0.5rem' }}>
            <FormConfirmButton onClick={handleConfirmAction} gridProps={{ xs: 6 }}>
              {i18n().modules.users.pages.form.content.buttons.confirmDialog}
            </FormConfirmButton>
            <FormCancelButton onClick={handleCloseDialog} gridProps={{ xs: 6 }}>
              {i18n().modules.users.pages.form.content.buttons.cancel}
            </FormCancelButton>
          </FormGridContainer>
        </DialogContent>
      </Dialog>

      <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit}>
        <Paper sx={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <FormGridContainer spacing={2} sx={{ width: '70%', justifyContent: 'center' }}>
            <FormGridItem xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Image
                data-testid="Image-user"
                alt={i18n().modules.users.pages.form.userImage}
                src={data?.image}
                sx={{ width: 100, height: 100, borderRadius: 50 }}
              />
            </FormGridItem>
            <FormTextInput
              control={control}
              name="name"
              label={i18n().modules.users.pages.form.content.inputs.name}
              error={errors.name?.message}
              required
              gridProps={{ sm: 6, xs: 12 }}
              loading={showLoading}
              disabled={formLoading || !canEdit}
              inputBox="standard"
            />
            <FormTextInput
              control={control}
              name="email"
              label={i18n().modules.users.pages.form.content.inputs.email}
              error={errors.email?.message}
              required
              gridProps={{ sm: 6, xs: 12 }}
              loading={showLoading}
              disabled={formLoading || !canEdit}
              inputBox="standard"
            />
            <FormTextInput
              control={control}
              name="document"
              mask={documentMask}
              label={i18n().modules.users.pages.form.content.inputs.document}
              error={errors.document?.message}
              required
              inputBox="standard"
              gridProps={{ sm: 6, xs: 12 }}
              loading={showLoading}
              disabled={!hasPermission({ role: UserRole.ADMIN }) || formLoading || !canEdit}
            />
            <FormTextInput
              control={control}
              name="phone"
              mask={phoneMask}
              label={i18n().modules.users.pages.form.content.inputs.phone}
              error={errors.phone?.message}
              gridProps={{ sm: 6, xs: 12 }}
              loading={showLoading}
              disabled={formLoading || !canEdit}
              inputBox="standard"
            />
            <FormSelectInput
              control={control}
              name="status"
              label={i18n().modules.users.pages.form.content.inputs.status}
              keyColumn="key"
              valueColumn="value"
              options={STATUSES}
              error={errors.status?.message}
              loading={showLoading}
              required
              gridProps={{ sm: 6, xs: 12 }}
              disabled={formLoading || !canEdit}
              inputBox="standard"
            />
            <FormSelectInput
              control={control}
              name="role"
              label={i18n().modules.users.pages.form.content.inputs.role}
              keyColumn="key"
              valueColumn="value"
              options={
                hasPermission({ role: UserRole.MANAGER })
                  ? ROLES.filter((role) => role.key !== 'admin')
                  : ROLES
              }
              error={errors.role?.message}
              loading={showLoading}
              required
              helperText={i18n().modules.users.pages.form.content.helperTexts.role}
              gridProps={{ sm: 6, xs: 12 }}
              disabled={formLoading || !canEdit}
              inputBox="standard"
            />

            <FormSwitch
              control={control}
              name="changePassword"
              label={i18n().modules.users.pages.profile.inputs.changePassword}
              gridProps={{ xs: 12, display: 'flex', justifyContent: 'center' }}
              loading={showLoading}
              disabled={formLoading || !canEdit}
            />
            {changePassword && (
              <>
                <FormTextInput
                  control={control}
                  name="password"
                  label={i18n().modules.users.pages.profile.inputs.password}
                  error={errors.password?.message}
                  required
                  gridProps={{ sm: 6, xs: 12 }}
                  loading={showLoading}
                  disabled={formLoading || !canEdit}
                  inputBox="standard"
                  inputProps={{ type: showPassword ? 'text' : 'password' }}
                  endAdornment={
                    <IconButton
                      data-testid="IconButton-togglePassword"
                      color="primary"
                      onClick={() => setShowPassword((oldState) => !oldState)}
                      disabled={formLoading || !canEdit}
                    >
                      {showPassword ? (
                        <VisibilityIcon data-testid="Icon-visibilityIcon" />
                      ) : (
                        <VisibilityOffIcon data-testid="Icon-visibilityOffIcon" />
                      )}
                    </IconButton>
                  }
                />
                <FormTextInput
                  control={control}
                  name="confirmPassword"
                  label={i18n().modules.users.pages.profile.inputs.confirmPassword}
                  error={errors.confirmPassword?.message}
                  required
                  gridProps={{ sm: 6, xs: 12 }}
                  loading={showLoading}
                  disabled={formLoading || !canEdit}
                  inputBox="standard"
                  inputProps={{ type: showConfirmPassword ? 'text' : 'password' }}
                  endAdornment={
                    <IconButton
                      data-testid="IconButton-toggleConfirmPassword"
                      color="primary"
                      onClick={() => setShowConfirmPassword((oldState) => !oldState)}
                      disabled={formLoading || !canEdit}
                    >
                      {showConfirmPassword ? (
                        <VisibilityIcon data-testid="Icon-visibilityIcon" />
                      ) : (
                        <VisibilityOffIcon data-testid="Icon-visibilityOffIcon" />
                      )}
                    </IconButton>
                  }
                />
              </>
            )}

            <FormConfirmButton
              disabled={showLoading || formLoading || !canEdit || hasAnyError}
              loading={showLoading || formLoading}
              gridProps={{ xs: 10, sm: 4 }}
            >
              {i18n().modules.users.pages.form.content.buttons.confirm}
            </FormConfirmButton>
            <FormCancelButton
              disabled={showLoading || formLoading}
              loading={showLoading || formLoading}
              gridProps={{ xs: 10, sm: 4 }}
              onClick={handleCancel}
            >
              {i18n().modules.users.pages.form.content.buttons.cancel}
            </FormCancelButton>
          </FormGridContainer>
        </Paper>
      </FormContainer>
    </Container>
  )
}
