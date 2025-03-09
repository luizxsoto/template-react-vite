import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

export function Forbidden(): JSX.Element {
  return (
    <Container
      sx={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h1">{StatusCodes.FORBIDDEN}</Typography>
      <Typography variant="h3">{i18n().common.pages.forbidden.title}</Typography>
      <Typography variant="subtitle1">{i18n().common.pages.forbidden.subTitle}</Typography>
    </Container>
  )
}
