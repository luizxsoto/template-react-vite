import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import loginBackgroundImage from '@/domain/auth/assets/login-bg-image.png'

interface BaseAuthLayoutProps {
  title: string
  children: React.ReactNode
}

export function BaseAuthLayout({ title, children }: BaseAuthLayoutProps): JSX.Element {
  return (
    <Container disableGutters sx={{ display: 'flex', padding: '1rem' }}>
      <Grid
        container
        sx={{ margin: 'auto', height: 600, width: 900, borderRadius: '0.5rem', overflow: 'hidden' }}
      >
        <Grid
          size={{
            xs: false,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          }}
          data-testid="BaseAuthLayout-backgroundImage"
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
            backgroundImage: `url(${loginBackgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '500px',
            backgroundPosition: 'center',
            borderRadius: '8px 0px 0px 8px',
          })}
        />

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          }}
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: 'calc(100% + 1rem)',
              paddingX: '2rem',
              marginLeft: '-1rem',
              borderRadius: '1rem 0 0 1rem',
              boxShadow: 'none',
              gap: '1rem',
            }}
          >
            <Typography
              data-testid="BaseAuthLayout-title"
              variant="h5"
              sx={{ textAlign: 'center' }}
            >
              {title}
            </Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }}>{children}</Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
