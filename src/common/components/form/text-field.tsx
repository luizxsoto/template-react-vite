import Grid2, { Grid2Props } from '@mui/material/Grid2'
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form'

import { TextField, TextFieldProps } from '@/common/components/text-field'

interface FormTextFieldProps<Model extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  control: Control<Model>
  name: Path<Model>
  gridProps?: Grid2Props
}

export function FormTextField<Model extends FieldValues>({
  control,
  name,
  gridProps,
  inputProps,
  onChangeEvent,
  ...restProps
}: FormTextFieldProps<Model>): JSX.Element {
  return (
    <Grid2 {...gridProps}>
      <Controller
        name={name}
        control={control}
        defaultValue={'' as PathValue<Model, Path<Model>>}
        render={({ field }) => (
          <TextField
            inputProps={{ ...inputProps, ...field }}
            onChangeEvent={(event) => {
              onChangeEvent?.(event)
              field.onChange(event)
            }}
            name={name}
            {...restProps}
          />
        )}
      />
    </Grid2>
  )
}
