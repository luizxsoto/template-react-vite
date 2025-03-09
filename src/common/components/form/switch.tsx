import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Grid2Props } from '@mui/material/Grid2'
import Switch, { SwitchProps } from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form'

import { FormGridItem } from '@/common/components/form/grid-item'

interface FormSwitchProps<Model extends FieldValues> {
  control: Control<Model>
  name: Path<Model>
  label: string
  required?: boolean
  gridProps?: Grid2Props
  switchProps?: SwitchProps
  disabled?: boolean
  onChange?: (newValue: boolean) => void
}

export function FormSwitch<Model extends FieldValues>({
  control,
  name,
  label,
  required,
  gridProps,
  switchProps,
  disabled,
  onChange,
}: FormSwitchProps<Model>): JSX.Element {
  return (
    <FormGridItem sx={{ marginTop: '0.2rem' }} {...gridProps}>
      <Controller
        name={name}
        control={control}
        defaultValue={'' as PathValue<Model, Path<Model>>}
        render={({ field: { value, ...field } }) => (
          <FormControlLabel
            data-testid={`Switch-${name}`}
            disabled={disabled}
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
            control={
              <Switch
                {...field}
                {...switchProps}
                value={Boolean(value)}
                checked={Boolean(value)}
                size="small"
                onChange={(event) => {
                  onChange?.(event.target.checked)
                  field.onChange(event)
                }}
              />
            }
          />
        )}
      />
    </FormGridItem>
  )
}
