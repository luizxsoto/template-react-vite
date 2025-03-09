import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Grid2Props } from '@mui/material/Grid2'

import { FormGridItem } from '@/common/components/form/grid-item'

interface FormConfirmButtonProps extends ButtonProps {
  gridProps?: Grid2Props
  loading?: boolean
}

export function FormConfirmButton({
  children,
  gridProps,
  loading,
  ...rest
}: FormConfirmButtonProps): JSX.Element {
  return (
    <FormGridItem {...gridProps}>
      <Button
        data-testid="Button-confirm"
        type="submit"
        fullWidth
        variant="contained"
        sx={{ color: 'white', textTransform: 'unset' }}
        {...rest}
      >
        {loading ? <CircularProgress size={25} /> : children}
      </Button>
    </FormGridItem>
  )
}
