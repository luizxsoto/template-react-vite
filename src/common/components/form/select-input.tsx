import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import Grid, { Grid2Props } from '@mui/material/Grid2'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { UseQueryResult } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Control, Controller, FieldValues, Path, useWatch } from 'react-hook-form'

import { FormGridItem } from '@/common/components/form/grid-item'
import { ListServiceResult } from '@/common/contracts/services'
import { debounceEvent } from '@/common/helpers/debounce'

interface FormSelectInputProps<TOption, Model extends FieldValues = FieldValues> {
  control: Control<Model>
  name: Path<Model>
  label: string
  keyColumn: keyof TOption
  valueColumn: keyof TOption
  options?: TOption[]
  error?: string
  listHook?: (params: {
    model: Record<string, number | string>
  }) => UseQueryResult<ListServiceResult<TOption>>
  onChange?: (newValue: TOption | null) => void
  required?: boolean
  gridProps?: Grid2Props
  disabled?: boolean
  inputBox?: 'filled' | 'outlined' | 'standard'
  helperText?: string
}

export function FormSelectInput<TOption, Model extends FieldValues = FieldValues>({
  control,
  name,
  label,
  keyColumn,
  valueColumn,
  options,
  error,
  listHook,
  onChange,
  required,
  gridProps,
  disabled,
  inputBox,
  helperText,
  ...rest
}: FormSelectInputProps<TOption, Model>): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<TOption | null>(null)
  const [filterParams, setFilterParams] = useState<Record<string, number | string>>({})
  const listHookData = listHook?.({ model: filterParams })
  const fieldValue = useWatch({ control, name })
  const parsedOptions = useMemo(() => {
    const parsedOpts = listHookData?.data?.registers ?? []
    options?.forEach((option) => {
      if (!parsedOpts.some((parsedOpt) => parsedOpt[keyColumn] === option[keyColumn])) {
        parsedOpts.push(option)
      }
    })
    if (
      selectedOption &&
      !parsedOpts.some((parsedOpt) => parsedOpt[keyColumn] === selectedOption[keyColumn])
    ) {
      parsedOpts.push(selectedOption)
    }
    return parsedOpts
  }, [keyColumn, listHookData?.data?.registers, options, selectedOption])

  const loadData = useCallback(
    (search = '') => {
      if (listHook) {
        setFilterParams(search ? { [valueColumn]: search } : {})
      }
    },
    [listHook, valueColumn],
  )

  const handleChangeText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      loadData(event.target.value.trim())
    },
    [loadData],
  )

  const handleChange = useCallback(
    (newValue: TOption | null, fieldOnChange: (param?: string) => void) => {
      fieldOnChange(newValue?.[keyColumn] as string)

      if (!newValue) {
        loadData()
      }

      if (onChange) {
        onChange(newValue)
      }
    },
    [keyColumn, onChange, loadData],
  )

  const getOptionLabel = useCallback(
    (option: unknown) => {
      const parsedOption = option as TOption

      return parsedOption[valueColumn] as string
    },
    [valueColumn],
  )

  const isOptionEqualToValue = useCallback(
    (option: unknown, newValue: unknown) => {
      const parsedOption = option as TOption
      const parsedValue = newValue as TOption

      return parsedOption[keyColumn] === parsedValue[keyColumn]
    },
    [keyColumn],
  )

  useEffect(() => {
    if (fieldValue !== selectedOption?.[keyColumn]) {
      setSelectedOption(
        parsedOptions.find((option) => option[keyColumn] === String(fieldValue)) ?? null,
      )
    }
  }, [fieldValue, keyColumn, parsedOptions, selectedOption])

  return (
    <FormGridItem sx={{ marginTop: '0.2rem' }} {...gridProps}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            data-testid={`SelectInput-${name}`}
            size="small"
            fullWidth
            options={parsedOptions}
            onChange={(_event, newValue) => handleChange(newValue as TOption, field.onChange)}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            loading={listHookData?.isLoading}
            value={selectedOption}
            autoHighlight
            disabled={disabled}
            {...rest}
            renderOption={(props, option) => (
              <ListItem
                data-testid={`SelectInput-ListItem-${name}-${option[keyColumn] as string}`}
                {...props}
                key={option[keyColumn] as string}
              >
                {option[valueColumn] as string}
              </ListItem>
            )}
            renderInput={(params) => (
              <FormControl fullWidth>
                {listHookData?.isLoading && (
                  <CircularProgress
                    size={26}
                    sx={{ position: 'absolute', top: '7.5px', right: '8px' }}
                  />
                )}
                <TextField
                  onChange={debounceEvent(handleChangeText)}
                  label={
                    <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                      {label}
                      {required ? (
                        <Typography color="error" sx={{ marginLeft: '0.2rem' }}>
                          *
                        </Typography>
                      ) : (
                        ''
                      )}
                    </Grid>
                  }
                  error={!!error}
                  helperText={error ?? helperText}
                  variant={inputBox ?? 'outlined'}
                  {...params}
                />
              </FormControl>
            )}
          />
        )}
      />
    </FormGridItem>
  )
}
