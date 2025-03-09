import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export interface TextFieldProps {
  name: string
  label: string
  hasError?: boolean
  helperText?: string
  required?: boolean
  inputProps?: MUITextFieldProps
  disabled?: boolean
  variant?: 'filled' | 'outlined' | 'standard'
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  mask?: (value: string) => string
  onChange?: (newValue: string) => void
  onChangeEvent?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function TextField({
  name,
  label,
  hasError,
  helperText,
  required,
  inputProps,
  disabled,
  variant = 'outlined',
  startAdornment,
  endAdornment,
  mask,
  onChange,
  onChangeEvent,
}: TextFieldProps): JSX.Element {
  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    let parsedValue = event.target.value

    if (mask) {
      const currentCursorPosition = event.target.selectionStart
      const newValue = event.target.value
      const slicedValue = newValue.slice(0, currentCursorPosition ?? 0).trim()
      const slicedValueWithMask = mask(slicedValue)
      parsedValue = mask(newValue)
      const newPosition = slicedValueWithMask.length
      event.target.value = parsedValue
      event.target.setSelectionRange(newPosition, newPosition)
    }

    onChange?.(parsedValue)
    onChangeEvent?.(event)
  }

  return (
    <MUITextField
      {...inputProps}
      data-testid={`TextField-${name}`}
      onChange={(event) => {
        handleChange(event)
      }}
      size="small"
      fullWidth
      label={
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {label}
          {required && (
            <Typography color="error" sx={(theme) => ({ marginLeft: theme.spacing(0.5) })}>
              *
            </Typography>
          )}
        </Box>
      }
      error={hasError}
      helperText={helperText}
      variant={variant}
      disabled={disabled}
      slotProps={{
        input: {
          startAdornment: startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ),
          endAdornment: endAdornment && (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ),
        },
      }}
    />
  )
}
