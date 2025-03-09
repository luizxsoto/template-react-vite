import Box from '@mui/material/Box'
import { Grid2Props } from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import { SxProps, Theme } from '@mui/material/styles'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form'

import { FormGridItem } from '@/common/components/form/grid-item'

export interface FormTextInputProps<Model extends FieldValues> {
  control: Control<Model>
  name: Path<Model>
  label: string
  error?: string
  helperText?: string
  required?: boolean
  gridProps?: Grid2Props
  inputProps?: TextFieldProps
  disabled?: boolean
  inputBox?: 'filled' | 'outlined' | 'standard'
  endAdornment?: JSX.Element
  maxLength?: number
  mask?: (value: string) => string
  onChange?: (newValue: string) => void
}

export function FormTextInput<Model extends FieldValues>({
  control,
  name,
  label,
  error,
  helperText,
  required,
  gridProps,
  inputProps,
  disabled,
  inputBox,
  endAdornment,
  maxLength,
  mask,
  onChange,
}: FormTextInputProps<Model>): JSX.Element {
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
  }

  return (
    <FormGridItem
      {...gridProps}
      sx={
        ((theme) => ({
          marginTop: '0.2rem',
          ...(typeof gridProps?.sx === 'function' ? gridProps.sx(theme) : gridProps?.sx),
        })) as SxProps<Theme>
      }
    >
      <Controller
        name={name}
        control={control}
        defaultValue={'' as PathValue<Model, Path<Model>>}
        render={({ field }) => (
          <TextField
            {...inputProps}
            {...field}
            data-testid={`TextField-${name}`}
            onChange={(event) => {
              handleChange(event)
              field.onChange(event)
            }}
            size="small"
            fullWidth
            label={
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {label}
                {!!required && (
                  <Typography color="error" sx={{ marginLeft: '0.2rem' }}>
                    *
                  </Typography>
                )}
              </Box>
            }
            error={!!error}
            helperText={error ?? helperText}
            variant={inputBox ?? 'outlined'}
            disabled={disabled}
            inputProps={{ maxLength }}
            InputProps={{
              endAdornment: endAdornment && (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ),
            }}
          />
        )}
      />
    </FormGridItem>
  )
}
