import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider as MaterialThemeProvider, createTheme } from '@mui/material/styles'
import { createContext, useCallback, useContext, useState } from 'react'

interface ThemeStateProps {
  mode: 'dark' | 'light'
}
interface ThemeContextProps extends ThemeStateProps {
  setTheme: (newData: ThemeStateProps) => void
}

const INITIAL_STATE: ThemeStateProps = {
  mode: 'light',
}
const ThemeContext = createContext<ThemeContextProps>(INITIAL_STATE as ThemeContextProps)

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, setState] = useState<ThemeStateProps>(INITIAL_STATE)

  const setTheme = useCallback(
    (newData: ThemeStateProps) => {
      setState((oldData) => ({ ...oldData, ...newData }))
    },
    [setState],
  )

  return (
    <MaterialThemeProvider
      theme={createTheme({
        palette: {
          mode: state.mode,
          background: { default: state.mode === 'dark' ? '#121212' : '#F6F6F6' },
        },
      })}
    >
      <CssBaseline />
      <GlobalStyles styles={{ '#root': { height: '100%' } }} />
      <ThemeContext.Provider value={{ ...state, setTheme }}>{children}</ThemeContext.Provider>
    </MaterialThemeProvider>
  )
}

export function useTheme(): ThemeContextProps {
  return useContext(ThemeContext)
}
