import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid2, { Grid2Props } from '@mui/material/Grid2'

type FormConfirmButtonProps = ButtonProps & {
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
    <Grid2 {...gridProps}>
      <Button data-testid="Button-confirm" type="submit" fullWidth variant="contained" {...rest}>
        {loading ? <CircularProgress size={25} /> : children}
      </Button>
    </Grid2>
  )
}
