import Grid, { Grid2Props } from '@mui/material/Grid2'

interface FormGridItemProps extends Omit<Grid2Props, 'size'> {
  size?: Record<'lg' | 'md' | 'sm' | 'xl' | 'xs', number>
}

export function FormGridItem({ size, ...restProps }: FormGridItemProps): JSX.Element {
  return (
    <Grid
      size={{
        xs: size?.xs,
        sm: size?.sm ?? size?.xs,
        md: size?.md ?? size?.sm ?? size?.xs,
        lg: size?.lg ?? size?.md ?? size?.sm ?? size?.xs,
        xl: size?.xl ?? size?.lg ?? size?.md ?? size?.sm ?? size?.xs,
      }}
      {...restProps}
    />
  )
}
