import Grid, { Grid2Props } from '@mui/material/Grid2'

interface FormGridContainerProps extends Grid2Props {}

export function FormGridContainer({ children, ...rest }: FormGridContainerProps): JSX.Element {
  return (
    <Grid container {...rest}>
      {children}
    </Grid>
  )
}
