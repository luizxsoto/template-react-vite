import { SxProps, styled } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form'

import { i18n } from '@/common/i18n'

const MuiForm = styled('form')({})

interface FormContainerProps<Model extends FieldValues> {
  formHandleSubmit: UseFormHandleSubmit<Model>
  onSubmit: (model: Model) => void
  children: React.ReactNode
  sx?: SxProps
}

export function FormContainer<Model extends FieldValues>({
  formHandleSubmit,
  onSubmit,
  children,
  ...rest
}: FormContainerProps<Model>): JSX.Element {
  const { enqueueSnackbar } = useSnackbar()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    let formData!: Model | undefined
    await formHandleSubmit((data) => {
      formData = data
    })(event)
    if (formData) {
      onSubmit(formData)
    } else {
      enqueueSnackbar(i18n().common.exceptions.validationException, {
        variant: 'warning',
      })
    }
  }

  return (
    <MuiForm onSubmit={handleSubmit} {...rest}>
      {children}
    </MuiForm>
  )
}
