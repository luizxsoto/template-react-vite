import Grid, { Grid2Props, GridSize } from '@mui/material/Grid2'

interface FormGridItemProps extends Grid2Props {}

export function FormGridItem({ size, ...restProps }: FormGridItemProps): JSX.Element {
  const parsedSize = (size ?? {}) as Partial<Record<'lg' | 'md' | 'sm' | 'xl' | 'xs', GridSize>>
  return (
    <Grid
      size={{
        xs: parsedSize.xs,
        sm: parsedSize.sm ?? parsedSize.xs,
        md: parsedSize.md ?? parsedSize.sm ?? parsedSize.xs,
        lg: parsedSize.lg ?? parsedSize.md ?? parsedSize.sm ?? parsedSize.xs,
        xl: parsedSize.xl ?? parsedSize.lg ?? parsedSize.md ?? parsedSize.sm ?? parsedSize.xs,
      }}
      {...restProps}
    />
  )
}
