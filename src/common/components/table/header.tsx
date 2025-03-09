import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Control, FieldErrors, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { FormContainer } from '@/common/components/form/container'
import { FormGridContainer } from '@/common/components/form/grid-container'
import { FormSelectInput } from '@/common/components/form/select-input'
import { FormTextInput, FormTextInputProps } from '@/common/components/form/text-input'
import { FormValueInput } from '@/common/components/form/value-input'
import { i18n } from '@/common/i18n'

import { FilterByOption, FilterByParams } from './types'

const maxFilterSize = 100
const minDaysFilter = 90

const validationSchema: yup.ObjectSchema<FilterByParams> = yup.object().shape({
  filterBy: yup.string().max(maxFilterSize, i18n().common.validators.max(maxFilterSize)),
  filterValue: yup.string().max(maxFilterSize, i18n().common.validators.max(maxFilterSize)),
  filterValueRange: yup.string().max(maxFilterSize, i18n().common.validators.max(maxFilterSize)),
})
const validationRangeSchema = validationSchema.shape({
  filterValue: yup
    .string()
    .required(i18n().common.validators.required)
    .max(maxFilterSize, i18n().common.validators.max(maxFilterSize))
    .test('minFieldRange', i18n().common.validators.lessThanNinety, (date) => {
      const [day, month, year] = date.split('/')
      if (
        new Date(Number(year), Number(month), Number(day)) <= new Date(+new Date() - minDaysFilter)
      ) {
        return true
      }

      return false
    }),
  filterValueRange: yup
    .string()
    .required(i18n().common.validators.required)
    .max(maxFilterSize, i18n().common.validators.max(maxFilterSize))
    .test('minFieldRange', i18n().common.validators.lessThanNinety, (date) => {
      const [day, month, year] = date.split('/')
      if (
        new Date(Number(year), Number(month), Number(day)) <= new Date(+new Date() - minDaysFilter)
      ) {
        return true
      }

      return false
    })
    .test(
      'fieldRange',
      i18n().common.validators.moreThanOtherInput,
      (date, context: { parent: { filterValue: string } }) => {
        const [inputDay, inputMonth, inputYear] = date.split('/')
        const [contextDay, contextMonth, contextYear] = context.parent.filterValue.split('/')
        if (
          new Date(Number(inputYear), Number(inputMonth), Number(inputDay)) >=
          new Date(Number(contextYear), Number(contextMonth), Number(contextDay))
        ) {
          return true
        }

        return false
      },
    ),
})

function sanitizer(params: FilterByParams): FilterByParams {
  return {
    filterBy: (params.filterBy ?? '').trim(),
    filterValue: (params.filterValue ?? '').trim(),
    filterValueRange: (params.filterValueRange ?? '').trim(),
  }
}

interface HeaderProps {
  title: string
  addFunction?: () => void
  onSubmitSearch: (params: Omit<FilterByParams, 'filterValueRange'>) => void
  filterByOptions: FilterByOption[]
  setFilterValues?: Dispatch<
    SetStateAction<{ filterValue: string | undefined; filterValueRange: string | undefined }>
  >
  loading?: boolean
  elements?: React.ReactNode
}

function SearchInput({
  name,
  label,
  control,
  isSelectVisible,
  selectedOption,
  filterByOptions,
  errors,
  isValueRangeVisible,
}: {
  name: keyof Omit<FilterByParams, 'filterBy'>
  label: string
  control: Control<FilterByParams>
  isSelectVisible: boolean
  selectedOption: FilterByOption | null
  filterByOptions: FilterByOption[]
  errors: FieldErrors<FilterByParams>
  isValueRangeVisible: boolean
}): JSX.Element {
  const defaultProps: FormTextInputProps<FilterByParams> = {
    control,
    label,
    name,
    inputProps: { sx: { minWidth: '100px' } },
    gridProps: isSelectVisible ? { size: { xs: 12, sm: 5, md: 3 } } : {},
    disabled: !selectedOption && isSelectVisible,
    helperText:
      !!selectedOption || filterByOptions.length === 1
        ? ''
        : i18n().common.components.table.header.selectAField,
    error: errors[name]?.message,
    required: isValueRangeVisible,
    mask: selectedOption?.mask ?? (isValueRangeVisible ? filterByOptions[0].mask : undefined),
  }

  const defaultInput = (): JSX.Element => <FormTextInput {...defaultProps} />

  const inputDict: Record<FilterByOption['format'], () => JSX.Element> = {
    string: defaultInput,
    integer: () => (
      <FormValueInput {...defaultProps} inputProps={{ decimalScale: 0, thousandSeparator: '' }} />
    ),
    date: defaultInput,
  }

  return (!selectedOption ? defaultInput : inputDict[selectedOption.format])()
}

export function Header({
  title,
  addFunction,
  onSubmitSearch,
  filterByOptions,
  setFilterValues,
  loading,
  elements,
}: HeaderProps): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<FilterByOption | null>(null)
  const isSelectVisible = filterByOptions.length !== 1
  const isValueRangeVisible =
    (!selectedOption && filterByOptions[0].type === 'range') || selectedOption?.type === 'range'

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FilterByParams>({
    resolver: async (values, ...args) =>
      yupResolver(isValueRangeVisible ? validationRangeSchema : validationSchema)(
        sanitizer({
          ...values,
          filterBy: filterByOptions.length === 1 ? filterByOptions[0].key : values.filterBy,
        }),
        ...args,
      ),
  })
  const filterValueInput = watch('filterValue')
  const filterValueRangeInput = watch('filterValueRange')

  function handleChangeOption(newValue: FilterByOption | null): void {
    setValue('filterValue', '')
    setValue('filterValueRange', '')
    setSelectedOption(newValue)
  }

  function onSubmit(model: FilterByParams): void {
    const parsedModel = { filterBy: model.filterBy, filterValue: model.filterValue }
    if (isValueRangeVisible) {
      parsedModel.filterValue = `${model.filterValue};${model.filterValueRange}`
    }
    onSubmitSearch(parsedModel)
  }

  useEffect(() => {
    setFilterValues?.({
      filterValue: filterValueInput,
      filterValueRange: filterValueRangeInput,
    })
  }, [filterValueInput, filterValueRangeInput, setFilterValues])

  return (
    <Toolbar data-testid="Table-Header" sx={{ padding: '0.5rem', gap: '0.5rem' }}>
      <Typography variant="h6">{title}</Typography>
      {addFunction && (
        <IconButton
          data-testid="Table-Header-AddButton"
          onClick={addFunction}
          color="primary"
          sx={{ width: '3.125rem', height: '3.125rem' }}
        >
          <AddIcon />
        </IconButton>
      )}
      {elements}
      <FormContainer formHandleSubmit={handleSubmit} onSubmit={onSubmit} sx={{ flex: 1 }}>
        <FormGridContainer
          justifyContent="right"
          alignItems="center"
          sx={{ gap: 1, alignItems: 'flex-start' }}
        >
          {isSelectVisible && (
            <FormSelectInput<FilterByOption>
              control={control}
              label={i18n().common.components.table.header.atField}
              name="filterBy"
              keyColumn="key"
              valueColumn="label"
              options={filterByOptions}
              onChange={handleChangeOption}
              gridProps={{ size: { xs: 12, sm: 5, md: 3 } }}
              disabled={loading}
              error={errors.filterBy?.message}
            />
          )}
          <SearchInput
            name="filterValue"
            label={
              isValueRangeVisible
                ? i18n().common.components.table.header.from
                : i18n().common.components.table.header.searchFor
            }
            control={control}
            isSelectVisible={isSelectVisible}
            selectedOption={selectedOption}
            filterByOptions={filterByOptions}
            errors={errors}
            isValueRangeVisible={isValueRangeVisible}
          />
          {isValueRangeVisible && (
            <SearchInput
              name="filterValueRange"
              label={i18n().common.components.table.header.to}
              control={control}
              isSelectVisible={isSelectVisible}
              selectedOption={selectedOption}
              filterByOptions={filterByOptions}
              errors={errors}
              isValueRangeVisible={isValueRangeVisible}
            />
          )}
          <IconButton data-testid="Table-Header-SearchButton" type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress size="1.875rem" />
            ) : (
              <SearchIcon sx={{ width: '1.875rem', height: '1.875rem' }} />
            )}
          </IconButton>
        </FormGridContainer>
      </FormContainer>
    </Toolbar>
  )
}
