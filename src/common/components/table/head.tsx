import CellBox from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'

import { i18n } from '@/common/i18n'

import { ActionFunction, CheckBoxProps, ColumnInfo } from './types'

interface HeadProps<Model = Record<string, unknown>> {
  columnInfos: ColumnInfo[]
  orderBy: string
  order: 'asc' | 'desc'
  onOrderByChange: (key: string) => void
  actionFunctions?: Array<ActionFunction<Model>>
  checkBoxProps?: Omit<CheckBoxProps<Model>, 'onCheckAll'> & {
    isAllChecked: boolean
    onCheckAll: (checked: boolean) => void
  }
}

export function Head<Model = Record<string, unknown>>({
  columnInfos,
  order,
  orderBy,
  onOrderByChange,
  actionFunctions,
  checkBoxProps,
}: HeadProps<Model>): JSX.Element {
  function HeadCells(): JSX.Element {
    function checkOrderBy(columnInfoKey: string): boolean {
      return [orderBy, `${orderBy}Formatted`].includes(columnInfoKey)
    }

    return (
      <>
        {columnInfos.map((columnInfo) => (
          <TableCell
            key={columnInfo.key}
            sortDirection={checkOrderBy(columnInfo.key) ? order : false}
          >
            {columnInfo.isSortable === false ? (
              columnInfo.label
            ) : (
              <TableSortLabel
                active={checkOrderBy(columnInfo.key)}
                direction={checkOrderBy(columnInfo.key) ? order : 'asc'}
                onClick={() => {
                  onOrderByChange(columnInfo.key.replace(/Formatted$/, ''))
                }}
              >
                {columnInfo.label}
                {checkOrderBy(columnInfo.key) ? (
                  <CellBox sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </CellBox>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </>
    )
  }

  return (
    <TableHead data-testid="Table-Head">
      <TableRow>
        {checkBoxProps && (
          <TableCell padding="checkbox">
            <Checkbox
              data-testid="Table-Head-Checkbox"
              color="primary"
              indeterminate={!!checkBoxProps.checkedRows.length && !checkBoxProps.isAllChecked}
              checked={checkBoxProps.isAllChecked}
              onChange={() => checkBoxProps.onCheckAll(!checkBoxProps.isAllChecked)}
            />
          </TableCell>
        )}
        <HeadCells />
        {actionFunctions && (
          <TableCell align="center">{i18n().common.components.table.head.actions}</TableCell>
        )}
      </TableRow>
    </TableHead>
  )
}
