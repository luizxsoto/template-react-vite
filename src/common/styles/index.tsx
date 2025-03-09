import CssBaseline from '@mui/material/CssBaseline'

import { ResetStyle } from './reset'

export function GlobalStyles(): JSX.Element {
  return (
    <>
      <CssBaseline />
      <ResetStyle />
    </>
  )
}
