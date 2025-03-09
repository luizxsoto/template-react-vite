import { yupResolver } from '@hookform/resolvers/yup'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { FormCancelButton } from '@/common/components/form/cancel-button'
import { FormConfirmButton } from '@/common/components/form/confirm-button'
import { FormContainer } from '@/common/components/form/container'
import { FormGridContainer } from '@/common/components/form/grid-container'
import { FormGridItem } from '@/common/components/form/grid-item'
import { FormSwitch } from '@/common/components/form/switch'
import { FormTextInput } from '@/common/components/form/text-input'
import { Image } from '@/common/components/image'
import { documentMask } from '@/common/helpers/document'
import { fileToBase64, validateMaxFileSize } from '@/common/helpers/file'
import { phoneMask } from '@/common/helpers/phone'
import { changePageTitle } from '@/common/helpers/window'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth/contexts'
import { UpdateUserProfileForm } from '@/domain/user/contracts/forms'
import { UserRole } from '@/domain/user/contracts/models'
import { useUpdateUserProfile } from '@/domain/user/hooks'
import { updateUserProfileFormSanitizer } from '@/domain/user/sanitizers'
import { updateUserProfileValidationSchema } from '@/domain/user/validations'

export function UserProfileForm(): JSX.Element {
  changePageTitle(i18n().modules.user.pages.profile.pageTitle)

  const [showPassword, setShowPassword] = useState(false)
  const [fileError, setFileError] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const updateUserProfile = useUpdateUserProfile()
  const { hasPermission, loggedUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const formLoading = isLoading || updateUserProfile.isPending

  const {
    control,
    handleSubmit,
    setError,
    reset,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserProfileForm>({
    defaultValues: { changePassword: false },
    resolver: async (values, ...args) =>
      yupResolver(updateUserProfileValidationSchema)(
        updateUserProfileFormSanitizer(values),
        ...args,
      ),
  })
  const hasAnyError = !!Object.keys(errors).length || !!fileError
  const changePassword = watch('changePassword')

  function handleCancel(): void {
    void navigate(-1)
  }

  function onSubmit(model: UpdateUserProfileForm): void {
    const params = {
      model: { ...model, image: selectedImage ?? model.image },
      onError: ({ validations }: { validations?: Record<string, string> }) => {
        if (validations) {
          Object.keys(validations).forEach((key) => {
            setError(key as 'root', { message: validations[key] })
          })
        }
      },
    }
    updateUserProfile.mutate(params)
  }

  async function handleChangeImage(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    if (!event.target.files?.length) {
      return
    }
    const maxFileMbSize = 4000
    const [isValidFileSize] = validateMaxFileSize(event, maxFileMbSize)
    if (!isValidFileSize) {
      return setFileError(i18n().modules.user.pages.profile.errors.imageSize)
    }
    const [base64Picture] = await fileToBase64(event)
    if (
      !['data:image/png', 'data:image/jpeg'].some((base64Type) =>
        base64Picture.startsWith(base64Type),
      )
    ) {
      return setFileError(i18n().modules.user.pages.profile.errors.imageType)
    }
    setSelectedImage(base64Picture)
    setValue('image', base64Picture)
    setFileError('')
  }

  useEffect(() => {
    if (loggedUser) {
      reset({
        ...loggedUser,
        changePassword: false,
        document: loggedUser.documentFormatted,
        phone: loggedUser.phoneFormatted ?? '',
        email: loggedUser.email ?? '',
        image: loggedUser.image ?? undefined,
      })
    }
  }, [reset, loggedUser])

  useEffect(() => {
    if (!changePassword && (errors.password ?? errors.confirmPassword)) {
      clearErrors(['password', 'confirmPassword'])
    }
  }, [changePassword, clearErrors, errors.confirmPassword, errors.password])

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        gap: '1rem',
      }}
    >
      <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit}>
        <Paper sx={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <FormGridContainer spacing={2} sx={{ width: '70%', justifyContent: 'center' }}>
            <FormGridItem size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <ButtonBase
                {...{ component: 'label' }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1rem',
                  gap: '1rem',
                  borderRadius: '1rem',
                }}
              >
                <Image
                  data-testid="Profile-image"
                  alt={i18n().modules.user.pages.profile.userImage}
                  src={selectedImage ?? loggedUser?.image}
                  sx={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <input
                  data-testid="Input-image"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleChangeImage}
                />
                <Box sx={(theme) => ({ display: 'flex', color: theme.palette.text.secondary })}>
                  <AddPhotoAlternateIcon />
                  <Typography data-testid="Typography-image">
                    {i18n().modules.user.pages.profile.inputs.image}
                  </Typography>
                </Box>
                {fileError && <Typography color="error">{fileError}</Typography>}
              </ButtonBase>
            </FormGridItem>
            <FormTextInput
              control={control}
              name="name"
              label={i18n().modules.user.pages.profile.inputs.name}
              error={errors.name?.message}
              required
              gridProps={{ size: { sm: 6, xs: 12 } }}
              disabled={formLoading}
              inputBox="standard"
            />
            <FormTextInput
              control={control}
              name="email"
              label={i18n().modules.user.pages.profile.inputs.email}
              error={errors.email?.message}
              required
              gridProps={{ size: { sm: 6, xs: 12 } }}
              disabled={formLoading}
              inputBox="standard"
            />
            <FormTextInput
              control={control}
              name="document"
              mask={documentMask}
              label={i18n().modules.user.pages.profile.inputs.document}
              error={errors.document?.message}
              required
              gridProps={{ size: { sm: 6, xs: 12 } }}
              disabled={!hasPermission({ role: UserRole.ADMIN }) || formLoading}
              inputBox="standard"
            />
            <FormTextInput
              control={control}
              name="phone"
              mask={phoneMask}
              label={i18n().modules.user.pages.profile.inputs.phone}
              error={errors.phone?.message}
              gridProps={{ size: { sm: 6, xs: 12 } }}
              disabled={formLoading}
              inputBox="standard"
            />

            <FormSwitch
              control={control}
              name="changePassword"
              label={i18n().modules.user.pages.profile.inputs.changePassword}
              gridProps={{ size: { sm: 12 }, display: 'flex', justifyContent: 'center' }}
              disabled={formLoading}
            />
            {changePassword && (
              <>
                <FormTextInput
                  control={control}
                  name="password"
                  label={i18n().modules.user.pages.profile.inputs.password}
                  error={errors.password?.message}
                  required
                  gridProps={{ size: { sm: 6, xs: 12 } }}
                  disabled={formLoading}
                  inputBox="standard"
                  inputProps={{ type: showPassword ? 'text' : 'password' }}
                  endAdornment={
                    <IconButton
                      data-testid="IconButton-togglePassword"
                      color="primary"
                      onClick={() => setShowPassword((oldState) => !oldState)}
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
                <FormTextInput
                  control={control}
                  name="confirmPassword"
                  label={i18n().modules.user.pages.profile.inputs.confirmPassword}
                  error={errors.confirmPassword?.message}
                  required
                  inputBox="standard"
                  gridProps={{ size: { sm: 6, xs: 12 } }}
                  disabled={formLoading}
                  inputProps={{ type: showConfirmPassword ? 'text' : 'password' }}
                  endAdornment={
                    <IconButton
                      data-testid="IconButton-toggleConfirmPassword"
                      color="primary"
                      onClick={() => setShowConfirmPassword((oldState) => !oldState)}
                      disabled={isLoading}
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
              disabled={isLoading || formLoading || hasAnyError}
              loading={isLoading || formLoading}
              gridProps={{ size: { xs: 10, sm: 4 } }}
            >
              {i18n().modules.user.pages.profile.buttons.confirm}
            </FormConfirmButton>
            <FormCancelButton
              disabled={isLoading || formLoading}
              loading={isLoading || formLoading}
              gridProps={{ size: { xs: 10, sm: 4 } }}
              onClick={handleCancel}
            >
              {i18n().modules.user.pages.profile.buttons.cancel}
            </FormCancelButton>
          </FormGridContainer>
        </Paper>
      </FormContainer>
    </Container>
  )
}
