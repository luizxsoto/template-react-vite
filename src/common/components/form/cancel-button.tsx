import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Grid2Props } from '@mui/material/Grid2'

import { FormGridItem } from '@/common/components/form/grid-item'

interface FormCancelButtonProps extends ButtonProps {
  gridProps?: Grid2Props
  loading?: boolean
}

export function FormCancelButton({
  children,
  gridProps,
  loading,
  ...rest
}: FormCancelButtonProps): JSX.Element {
  return (
    <FormGridItem {...gridProps}>
      <Button
        data-testid="Button-cancel"
        type="button"
        fullWidth
        variant="outlined"
        color="error"
        sx={{ textTransform: 'unset' }}
        {...rest}
      >
        {loading ? <CircularProgress size={25} color="error" /> : children}
      </Button>
    </FormGridItem>
  )
}
