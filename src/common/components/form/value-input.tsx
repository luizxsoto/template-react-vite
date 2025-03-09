import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { Grid2Props } from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import { InputBaseComponentProps } from '@mui/material/InputBase'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { forwardRef } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

import { FormGridItem } from '@/common/components/form/grid-item'

const NumberFormatCustom = forwardRef<typeof NumericFormat, NumericFormatProps>(
  function NumberFormatCustom({ ...rest }: NumericFormatProps, inputRef): JSX.Element {
    const MAX_VALUE = 999999999.99

    return (
      <NumericFormat
        getInputRef={inputRef}
        thousandSeparator="."
        decimalSeparator=","
        fixedDecimalScale
        decimalScale={2}
        allowNegative={false}
        isAllowed={(values) => {
          const { floatValue } = values

          return floatValue === undefined || floatValue <= MAX_VALUE
        }}
        {...rest}
      />
    )
  },
)

interface FormValueInputProps<Model extends FieldValues> {
  control: Control<Model>
  name: Path<Model>
  label: string
  error?: string
  helperText?: string
  required?: boolean
  gridProps?: Grid2Props
  inputProps?: NumericFormatProps<TextFieldProps>
  disabled?: boolean
  endAdornment?: JSX.Element
}

export function FormValueInput<Model extends FieldValues>({
  control,
  name,
  label,
  error,
  helperText,
  required,
  gridProps,
  inputProps,
  disabled,
  endAdornment,
  ...rest
}: FormValueInputProps<Model>): JSX.Element {
  return (
    <FormGridItem sx={{ marginTop: '0.2rem' }} {...gridProps}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!error}>
            <TextField
              {...field}
              size="small"
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
              disabled={disabled}
              {...rest}
              inputProps={{ ...inputProps } as InputBaseComponentProps}
              InputProps={{
                endAdornment: endAdornment && (
                  <InputAdornment position="end">{endAdornment}</InputAdornment>
                ),
                inputComponent: NumberFormatCustom as React.ElementType<InputBaseComponentProps>,
              }}
            />
          </FormControl>
        )}
      />
    </FormGridItem>
  )
}
