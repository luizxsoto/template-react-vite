import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { STALE_TIME } from '@/common/constants/react-query'
import { AuthProvider } from '@/domain/auth/contexts'

import { IdleTimerProvider } from './idle-timer'
import { SnackbarProvider } from './snack-bar'
import { ThemeProvider } from './theme'

interface ContextProps {
  children: React.ReactNode
}

export function Contexts({ children }: ContextProps): JSX.Element {
  return [
    (props: ContextProps) => (
      <QueryClientProvider
        {...props}
        client={
          new QueryClient({
            defaultOptions: {
              queries: { staleTime: STALE_TIME, retry: false, refetchOnWindowFocus: false },
            },
          })
        }
      />
    ),
    AuthProvider,
    IdleTimerProvider,
    ThemeProvider,
    SnackbarProvider,
  ].reduce(
    (AccumulatedProviders, CurrentProvider) =>
      // eslint-disable-next-line react/display-name
      ({ children: currentChildren }: ContextProps) => {
        return (
          <AccumulatedProviders>
            <CurrentProvider>{currentChildren}</CurrentProvider>
          </AccumulatedProviders>
        )
      },
    ({ children: currentChildren }) => <>{currentChildren}</>,
  )({ children })
}
