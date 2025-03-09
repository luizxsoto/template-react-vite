import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import TableWrapper from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import { UseQueryResult } from '@tanstack/react-query'
import _IsEqual from 'lodash.isequal'
import { useSnackbar } from 'notistack'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ListServiceResult } from '@/common/contracts/services'
import { i18n } from '@/common/i18n'

import { Body } from './body'
import { Head } from './head'
import { Header } from './header'
import { Pagination } from './pagination'
import {
  ActionFunction,
  CheckBoxProps,
  ColumnInfo,
  FilterByOption,
  FilterByParams,
  FilterParams,
} from './types'

const elementId = 'table-container'

interface TableProps<ListData extends ListServiceResult<Model>, Model = Record<string, unknown>> {
  title: string
  listModelKey: keyof Model
  columnInfos: ColumnInfo[]
  listHook: (params: { model: FilterParams }) => UseQueryResult<ListData>
  listHookParams?: Record<string, string[] | boolean | number | string | undefined>
  defaultFilterParams?: Partial<FilterParams>
  filterByOptions: FilterByOption[]
  setFilterValues?: Dispatch<
    SetStateAction<{ filterValue: string | undefined; filterValueRange: string | undefined }>
  >
  addFunction?: () => void
  actionFunctions?: Array<ActionFunction<Model>>
  loading?: boolean
  rowSanitizer?: (model: Model) => Record<string, unknown>
  headerElements?: React.ReactNode
  checkBoxProps?: CheckBoxProps<Model>
}

export function Table<ListData extends ListServiceResult<Model>, Model = Record<string, unknown>>({
  title,
  listModelKey,
  columnInfos,
  listHook,
  filterByOptions,
  setFilterValues,
  defaultFilterParams,
  addFunction,
  actionFunctions,
  loading,
  rowSanitizer,
  listHookParams,
  headerElements,
  checkBoxProps,
}: TableProps<ListData, Model>): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterParams, setFilterParams] = useState<FilterParams>(() => {
    const parsedSearchParams = Object.fromEntries(searchParams) as Partial<FilterParams>
    return {
      page: Number(parsedSearchParams.page ?? defaultFilterParams?.page ?? 1),
      perPage: Number(parsedSearchParams.perPage ?? defaultFilterParams?.perPage ?? 10),
      orderBy: parsedSearchParams.orderBy ?? defaultFilterParams?.orderBy ?? 'id',
      order: parsedSearchParams.order ?? defaultFilterParams?.order ?? 'desc',
      ...listHookParams,
    }
  })
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading } = listHook({ model: filterParams })
  const parsedData =
    rowSanitizer && data?.registers
      ? data.registers.map((register) => rowSanitizer(register))
      : (data?.registers ?? [])
  const [oldData, setOldData] = useState(data)
  const parsedTotal = data?.total ?? oldData?.total ?? 0

  function handleSubmitSearch({
    filterBy,
    filterValue,
  }: Omit<FilterByParams, 'filterValueRange'>): void {
    if (filterBy && filterValue) {
      setFilterParams((oldValue) => ({
        page: oldValue.page,
        perPage: oldValue.perPage,
        orderBy: oldValue.orderBy,
        order: oldValue.order,
        [filterBy]: filterValue,
        ...listHookParams,
      }))
    } else {
      setFilterParams((oldValue) => ({
        page: 1,
        perPage: oldValue.perPage,
        orderBy: oldValue.orderBy,
        order: oldValue.order,
        ...listHookParams,
      }))
    }
  }

  function onPageChange(newPage: number): void {
    setFilterParams((oldValue) => ({ ...oldValue, page: newPage + 1 }))
  }

  function onPerPageChange(newPerPage: number): void {
    setFilterParams((oldValue) => ({ ...oldValue, page: 1, perPage: newPerPage }))
  }

  function onOrderByChange(newOrderBy: string): void {
    const isAsc = filterParams.orderBy === newOrderBy && filterParams.order === 'asc'
    const order = isAsc ? 'desc' : 'asc'
    setFilterParams((oldValue) => ({ ...oldValue, page: 1, order, orderBy: newOrderBy }))
  }

  function onCheckRow(model: Model): void {
    if (checkBoxProps) {
      const rowFound = checkBoxProps.checkedRows.some(
        (checkedRow) => checkedRow[listModelKey] === model[listModelKey],
      )
      if (
        !rowFound &&
        checkBoxProps.maxCheckLength &&
        checkBoxProps.maxCheckLength === checkBoxProps.checkedRows.length
      ) {
        enqueueSnackbar(i18n().common.validators.selectMaxSize(checkBoxProps.maxCheckLength), {
          variant: 'warning',
        })
      } else {
        checkBoxProps.onCheck(model)
      }
    }
  }

  function onCheckAllRows(checked: boolean): void {
    if (checkBoxProps && data?.registers) {
      const maxCheckLength = checkBoxProps.maxCheckLength ?? data.registers.length
      if (
        checked &&
        checkBoxProps.maxCheckLength &&
        checkBoxProps.checkedRows.length !== maxCheckLength &&
        data.registers.length > checkBoxProps.maxCheckLength
      ) {
        enqueueSnackbar(i18n().common.validators.selectMaxSize(checkBoxProps.maxCheckLength), {
          variant: 'warning',
        })
      }
      checkBoxProps.onCheckAll(
        checked && checkBoxProps.checkedRows.length < maxCheckLength
          ? data.registers.slice(0, maxCheckLength)
          : [],
      )
    }
  }

  useEffect(() => {
    if (data) {
      setOldData(data)
    }
  }, [data])

  useEffect(() => {
    if (listHookParams) {
      setFilterParams((oldValue) => ({ ...oldValue, ...listHookParams }))
    }
  }, [listHookParams])

  useEffect(() => {
    const oldSearchParams = Object.fromEntries(searchParams) as FilterParams
    const newSearchParams = {
      page: String(filterParams.page),
      perPage: String(filterParams.perPage),
      orderBy: filterParams.orderBy,
      order: filterParams.order,
    }
    if (!_IsEqual(oldSearchParams, newSearchParams)) {
      setSearchParams(newSearchParams, { replace: true })
    }
  }, [filterParams, searchParams, setSearchParams])

  return (
    <Paper
      sx={{
        maxWidth: '100%',
        width: '100%',
        minHeight: 300,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Header
        title={title}
        addFunction={addFunction}
        onSubmitSearch={handleSubmitSearch}
        filterByOptions={filterByOptions}
        setFilterValues={setFilterValues}
        loading={isLoading || loading}
        elements={headerElements}
      />
      <Box sx={{ display: 'flex', flex: 1, position: 'relative', overflow: 'auto' }}>
        {(isLoading || loading) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              zIndex: '999',
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              opacity: '50%',
            }}
          >
            <CircularProgress data-testid="Table-CircularProgress" />
          </Box>
        )}
        <TableContainer id={elementId}>
          <TableWrapper stickyHeader size="small">
            <Head<Model>
              columnInfos={columnInfos}
              order={filterParams.order}
              orderBy={filterParams.orderBy}
              onOrderByChange={onOrderByChange}
              actionFunctions={actionFunctions}
              checkBoxProps={
                checkBoxProps && {
                  ...checkBoxProps,
                  onCheckAll: onCheckAllRows,
                  isAllChecked:
                    !!data?.registers.length &&
                    checkBoxProps.checkedRows.length === data.registers.length,
                }
              }
            />
            <Body<Model>
              listModelKey={listModelKey}
              modelList={parsedData as Model[]}
              columnInfos={columnInfos}
              actionFunctions={actionFunctions}
              checkBoxProps={
                checkBoxProps && {
                  ...checkBoxProps,
                  onCheck: onCheckRow,
                }
              }
            />
          </TableWrapper>
        </TableContainer>
      </Box>
      <Pagination
        count={parsedTotal}
        page={parsedTotal ? filterParams.page - 1 : 0}
        rowsPerPage={filterParams.perPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        elementId={elementId}
      />
    </Paper>
  )
}
