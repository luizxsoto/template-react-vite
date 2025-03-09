import { styled } from '@mui/material/styles'
import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack'
import { useRef } from 'react'

import { CloseButton } from '@/common/components/close-button'

const Snackbar = styled(NotistackSnackbarProvider)({
  maxWidth: '20rem',
  maxHeight: '7rem',
  overflow: 'hidden',
})

export function SnackbarProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const snackRef = useRef<NotistackSnackbarProvider>(null)

  return (
    <Snackbar
      ref={snackRef}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      maxSnack={3}
      preventDuplicate
      action={(key) => (
        <CloseButton
          sx={{ position: 'absolute', top: 9, right: 2 }}
          onClick={() => snackRef.current?.closeSnackbar(key)}
        />
      )}
    >
      {children}
    </Snackbar>
  )
}
