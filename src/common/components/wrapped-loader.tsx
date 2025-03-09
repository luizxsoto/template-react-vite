import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export function WrappedLoader(): JSX.Element {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={100} />
    </Box>
  )
}
