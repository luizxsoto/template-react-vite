import Grid from '@mui/material/Grid2'
import PaginationComponent from '@mui/material/TablePagination'

import { GoToTopButton } from '@/common/components/go-to-top-button'
import { i18n } from '@/common/i18n'

interface PaginationProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newRowsPerPage: number) => void
  elementId: string
}

export function Pagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  elementId,
}: PaginationProps): JSX.Element {
  function handleOnPageChange(newPage: number): void {
    onPageChange(newPage)
    document.getElementById(elementId)?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Grid sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <PaginationComponent
        component="div"
        rowsPerPageOptions={[10, 25, 50]}
        labelDisplayedRows={({ from, to }) =>
          `${from}-${to} ${i18n().common.components.table.pagination.from} ${count}`
        }
        labelRowsPerPage={i18n().common.components.table.pagination.rowsPerPage}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_event: unknown, newPage: number) => handleOnPageChange(newPage)}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onRowsPerPageChange(+event.target.value)
        }}
      />

      <GoToTopButton elementId={elementId} sx={{ bottom: 8 }} />
    </Grid>
  )
}
